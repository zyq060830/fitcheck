import Foundation
import AVFoundation
import Vision
import AppKit

struct FrameOCR: Codable {
    let timeSec: Double
    let imagePath: String
    let text: String
}

struct PipelineOutput: Codable {
    let videoPath: String
    let audioPath: String?
    let durationSec: Double
    let frames: [FrameOCR]
}

enum PipelineError: Error {
    case invalidArguments
    case exportFailed(String)
    case imageWriteFailed(String)
}

func fileURL(_ path: String) -> URL {
    URL(fileURLWithPath: path)
}

func ensureDirectory(_ url: URL) throws {
    try FileManager.default.createDirectory(at: url, withIntermediateDirectories: true)
}

func durationSeconds(of asset: AVAsset) -> Double {
    let seconds = CMTimeGetSeconds(asset.duration)
    if seconds.isFinite && seconds > 0 {
        return seconds
    }
    return 0
}

func makeFrameTimes(duration: Double, maxFrames: Int) -> [Double] {
    guard duration > 0 else { return [0.2] }
    if duration <= 4 {
        return [min(0.2, duration), max(duration * 0.5, 0.2), max(duration - 0.2, 0.2)]
    }

    let count = max(1, min(maxFrames, 5))
    var result: [Double] = []
    for index in 0..<count {
        let progress = Double(index + 1) / Double(count + 1)
        let sec = max(0.2, duration * progress)
        result.append(min(sec, max(duration - 0.2, 0.2)))
    }
    return result
}

func exportAudio(asset: AVAsset, outputURL: URL) throws -> String? {
    guard let export = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetAppleM4A) else {
        return nil
    }

    if FileManager.default.fileExists(atPath: outputURL.path) {
        try FileManager.default.removeItem(at: outputURL)
    }

    export.outputURL = outputURL
    export.outputFileType = .m4a

    let semaphore = DispatchSemaphore(value: 0)
    var exportError: Error?
    export.exportAsynchronously {
        exportError = export.error
        semaphore.signal()
    }
    semaphore.wait()

    if let exportError {
        throw PipelineError.exportFailed(exportError.localizedDescription)
    }
    guard export.status == .completed else {
        return nil
    }
    return outputURL.path
}

func ocrText(from image: CGImage) throws -> String {
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["zh-Hans", "en-US"]
    request.usesLanguageCorrection = true

    let handler = VNImageRequestHandler(cgImage: image)
    try handler.perform([request])

    let observations = request.results ?? []
    let lines = observations.compactMap { $0.topCandidates(1).first?.string.trimmingCharacters(in: .whitespacesAndNewlines) }
    return lines.filter { !$0.isEmpty }.joined(separator: "\n")
}

func writeJPEG(image: CGImage, to url: URL) throws {
    let bitmap = NSBitmapImageRep(cgImage: image)
    guard let data = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.82]) else {
        throw PipelineError.imageWriteFailed(url.path)
    }
    try data.write(to: url)
}

func extractFrames(asset: AVAsset, outputDirectory: URL, duration: Double) throws -> [FrameOCR] {
    let generator = AVAssetImageGenerator(asset: asset)
    generator.appliesPreferredTrackTransform = true
    generator.requestedTimeToleranceAfter = CMTime(seconds: 0.25, preferredTimescale: 600)
    generator.requestedTimeToleranceBefore = CMTime(seconds: 0.25, preferredTimescale: 600)

    let times = makeFrameTimes(duration: duration, maxFrames: 4)
    var frames: [FrameOCR] = []

    for (index, second) in times.enumerated() {
        let time = CMTime(seconds: second, preferredTimescale: 600)
        let cgImage = try generator.copyCGImage(at: time, actualTime: nil)
        let imageURL = outputDirectory.appendingPathComponent("frame-\(index + 1).jpg")
        try writeJPEG(image: cgImage, to: imageURL)
        let text = (try? ocrText(from: cgImage)) ?? ""
        frames.append(
            FrameOCR(
                timeSec: second,
                imagePath: imageURL.path,
                text: text
            )
        )
    }

    return frames
}

func runPipeline(videoPath: String, outputDirectory: String) throws -> PipelineOutput {
    let videoURL = fileURL(videoPath)
    let outDir = fileURL(outputDirectory)
    try ensureDirectory(outDir)

    let asset = AVURLAsset(url: videoURL)
    let duration = durationSeconds(of: asset)
    let audioPath = try exportAudio(asset: asset, outputURL: outDir.appendingPathComponent("audio.m4a"))
    let frames = try extractFrames(asset: asset, outputDirectory: outDir, duration: duration)

    return PipelineOutput(
        videoPath: videoPath,
        audioPath: audioPath,
        durationSec: duration,
        frames: frames
    )
}

do {
    let arguments = CommandLine.arguments
    guard arguments.count >= 4 else {
        throw PipelineError.invalidArguments
    }

    let command = arguments[1]
    guard command == "analyze" else {
        throw PipelineError.invalidArguments
    }

    let result = try runPipeline(videoPath: arguments[2], outputDirectory: arguments[3])
    let data = try JSONEncoder().encode(result)
    if let json = String(data: data, encoding: .utf8) {
        print(json)
    }
} catch {
    let message: String
    switch error {
    case PipelineError.invalidArguments:
        message = "Usage: swift media_pipeline.swift analyze <videoPath> <outputDirectory>"
    case PipelineError.exportFailed(let detail):
        message = "Audio export failed: \(detail)"
    case PipelineError.imageWriteFailed(let path):
        message = "Image write failed: \(path)"
    default:
        message = error.localizedDescription
    }
    FileHandle.standardError.write(Data(message.utf8))
    exit(1)
}
