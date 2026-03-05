package com.example.demo.controller;

import com.example.demo.service.VisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/api/scan")
@CrossOrigin(origins = "*")
public class ScanController {

    @Autowired
    private VisionService visionService;

    @PostMapping
    public String scanPart(@RequestParam("image") MultipartFile image)
            throws Exception {

        File tempFile = File.createTempFile("scan", ".jpg");
        image.transferTo(tempFile);

        String detectedText = visionService.detectText(tempFile);

        return detectedText;
    }
}