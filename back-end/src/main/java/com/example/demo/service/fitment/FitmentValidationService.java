package com.example.demo.service.fitment;

import com.example.demo.model.dto.VehicleSearchRequest;
import com.example.demo.model.entity.Listing;
import com.example.demo.model.entity.ListingFitment;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FitmentValidationService {

    public List<Listing> validateFitment(
            List<Listing> listings,
            VehicleSearchRequest request
    ) {

        return listings.stream()
                .filter(listing ->
                        listing.getFitments() != null &&
                                listing.getFitments().stream()
                                        .anyMatch(fitment ->
                                                isCompatible(fitment, request)
                                        )
                )
                .collect(Collectors.toList());
    }

    public boolean isExactMatch(
            Listing listing,
            VehicleSearchRequest request
    ) {

        if (listing.getFitments() == null) return false;

        return listing.getFitments().stream()
                .anyMatch(fitment ->
                        isCompatible(fitment, request)
                                && isExact(fitment, request)
                );
    }

    private boolean isCompatible(
            ListingFitment fitment,
            VehicleSearchRequest request
    ) {

        if (request.getYear() < fitment.getYearStart()
                || request.getYear() > fitment.getYearEnd()) {
            return false;
        }

        if (!request.getMake()
                .equalsIgnoreCase(fitment.getMake())) {
            return false;
        }

        if (!request.getModel()
                .equalsIgnoreCase(fitment.getModel())) {
            return false;
        }

        return true;
    }

    private boolean isExact(
            ListingFitment fitment,
            VehicleSearchRequest request
    ) {

        if (request.getTrim() != null
                && fitment.getTrim() != null
                && !request.getTrim()
                .equalsIgnoreCase(fitment.getTrim())) {
            return false;
        }

        if (request.getEngine() != null
                && fitment.getEngine() != null
                && !request.getEngine()
                .equalsIgnoreCase(fitment.getEngine())) {
            return false;
        }

        return true;
    }
}