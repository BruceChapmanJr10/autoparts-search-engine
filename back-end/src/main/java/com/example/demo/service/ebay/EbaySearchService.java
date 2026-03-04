package com.example.demo.service.ebay;

import com.example.demo.model.dto.ListingResponse;
import com.example.demo.model.dto.VehicleSearchRequest;
import com.example.demo.model.entity.Listing;
import com.example.demo.model.entity.ListingFitment;
import com.example.demo.repository.ListingRepository;
import com.example.demo.service.fitment.FitmentValidationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EbaySearchService {

    private final ListingRepository listingRepository;
    private final FitmentValidationService fitmentValidationService;

    private static final long CACHE_EXPIRATION_MS = 21600000;

    public EbaySearchService(
            ListingRepository listingRepository,
            FitmentValidationService fitmentValidationService
    ) {
        this.listingRepository = listingRepository;
        this.fitmentValidationService = fitmentValidationService;
    }

    /**
     * Keyword search
     */
    public List<ListingResponse> search(String query) {

        long now = System.currentTimeMillis();

        List<Listing> cached =
                listingRepository.findBySearchQueryAndSource(query, "EBAY");

        boolean cacheValid = !cached.isEmpty() &&
                cached.stream()
                        .allMatch(l ->
                                (now - l.getLastUpdated()) < CACHE_EXPIRATION_MS
                        );

        if (cacheValid) {
            return cached.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }

        List<ListingResponse> results = List.of(

                ListingResponse.builder()
                        .title("Honda Accord Brake Pads OEM")
                        .source("EBAY")
                        .price(84.99)
                        .shippingCost(6.99)
                        .totalPrice(91.98)
                        .productUrl("https://www.ebay.com/mock-fitment-1")
                        .imageUrl("https://images.unsplash.com/photo-1605559424843-9e4c228bf1c6?auto=format&fit=crop&w=800&q=80")
                        .availability("In Stock")
                        .build()
        );

        saveOrUpdate(results, query);

        return results;
    }

    /**
     * Vehicle search
     */
    public List<ListingResponse> searchWithVehicle(
            VehicleSearchRequest request,
            String query
    ) {

        long now = System.currentTimeMillis();

        List<Listing> cached =
                listingRepository.findBySearchQueryAndSource(query, "EBAY");

        boolean cacheValid = !cached.isEmpty() &&
                cached.stream()
                        .allMatch(l ->
                                (now - l.getLastUpdated()) < CACHE_EXPIRATION_MS
                        );

        if (cacheValid) {

            List<Listing> validated =
                    fitmentValidationService.validateFitment(
                            cached,
                            request
                    );

            return validated.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }

        List<ListingResponse> results = List.of(

                ListingResponse.builder()
                        .title("Honda Accord Brake Pads OEM")
                        .source("EBAY")
                        .price(84.99)
                        .shippingCost(6.99)
                        .totalPrice(91.98)
                        .productUrl("https://www.ebay.com/mock-fitment-1")
                        .imageUrl("https://images.unsplash.com/photo-1581093458791-9f3c3900b1f1?auto=format&fit=crop&w=800&q=80")                        .availability("In Stock")
                        .build(),

                ListingResponse.builder()
                        .title("Ford F-150 Heavy Duty Brake Pads")
                        .source("EBAY")
                        .price(129.99)
                        .shippingCost(10.99)
                        .totalPrice(140.98)
                        .productUrl("https://www.ebay.com/mock-fitment-3")
                        .imageUrl("https://images.unsplash.com/photo-1605559424843-9e4c228bf1c6?auto=format&fit=crop&w=800&q=80")                        .availability("In Stock")
                        .build()
        );

        saveOrUpdate(results, query);

        List<Listing> fresh =
                listingRepository.findBySearchQueryAndSource(query, "EBAY");

        List<Listing> validated =
                fitmentValidationService.validateFitment(
                        fresh,
                        request
                );

        return validated.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void saveOrUpdate(
            List<ListingResponse> results,
            String query
    ) {

        long now = System.currentTimeMillis();

        results.forEach(r -> {

            listingRepository.findByProductUrl(r.getProductUrl())
                    .ifPresentOrElse(existing -> {

                        existing.setPrice(r.getPrice());
                        existing.setShippingCost(r.getShippingCost());
                        existing.setTotalPrice(r.getTotalPrice());
                        existing.setAvailability(r.getAvailability());
                        existing.setImageUrl(r.getImageUrl());
                        existing.setLastUpdated(now);
                        existing.setSearchQuery(query);

                        listingRepository.save(existing);

                    }, () -> {

                        Listing listing = Listing.builder()
                                .searchQuery(query)
                                .title(r.getTitle())
                                .source(r.getSource())
                                .price(r.getPrice())
                                .shippingCost(r.getShippingCost())
                                .totalPrice(r.getTotalPrice())
                                .productUrl(r.getProductUrl())
                                .imageUrl(r.getImageUrl())
                                .availability(r.getAvailability())
                                .lastUpdated(now)
                                .build();

                        listingRepository.save(listing);
                    });
        });
    }

    private ListingResponse mapToResponse(Listing listing) {

        return ListingResponse.builder()
                .title(listing.getTitle())
                .source(listing.getSource())
                .price(listing.getPrice())
                .shippingCost(listing.getShippingCost())
                .totalPrice(listing.getTotalPrice())
                .productUrl(listing.getProductUrl())
                .imageUrl(listing.getImageUrl())
                .availability(listing.getAvailability())
                .build();
    }
}