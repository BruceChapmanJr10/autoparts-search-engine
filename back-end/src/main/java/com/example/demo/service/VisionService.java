package com.example.demo.service;

import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class VisionService {

    public String detectText(File imageFile) {

        try (ImageAnnotatorClient vision = ImageAnnotatorClient.create()) {

            ByteString imgBytes =
                    ByteString.readFrom(new FileInputStream(imageFile));

            Image img = Image.newBuilder()
                    .setContent(imgBytes)
                    .build();

            Feature feature = Feature.newBuilder()
                    .setType(Feature.Type.TEXT_DETECTION)
                    .build();

            AnnotateImageRequest request =
                    AnnotateImageRequest.newBuilder()
                            .addFeatures(feature)
                            .setImage(img)
                            .build();

            BatchAnnotateImagesResponse response =
                    vision.batchAnnotateImages(List.of(request));

            AnnotateImageResponse res =
                    response.getResponsesList().get(0);

            if (res.hasError()) {
                return "Vision API error: " + res.getError().getMessage();
            }

            List<EntityAnnotation> annotations =
                    res.getTextAnnotationsList();

            if (annotations.isEmpty()) {
                return "No text detected";
            }

            // Full detected text
            String text = annotations.get(0).getDescription();

            System.out.println("----- VISION RAW TEXT -----");
            System.out.println(text);
            System.out.println("---------------------------");

            // Clean the text
            text = text.replaceAll("[^A-Za-z0-9]", " ");

            // Extract possible part numbers
            Pattern pattern = Pattern.compile("[A-Z0-9]{4,}");
            Matcher matcher = pattern.matcher(text);

            String bestMatch = "";

            while (matcher.find()) {

                String candidate = matcher.group();

                if (candidate.length() > bestMatch.length()) {
                    bestMatch = candidate;
                }
            }

            if (bestMatch.isEmpty()) {
                return "No part number detected";
            }

            return bestMatch;

        } catch (Exception e) {
            throw new RuntimeException("Vision API failed", e);
        }
    }
}