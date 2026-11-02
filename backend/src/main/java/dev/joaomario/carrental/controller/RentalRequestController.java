package dev.joaomario.carrental.controller;

import dev.joaomario.carrental.dto.contract.ContractRequest;
import dev.joaomario.carrental.dto.contract.ContractResponse;
import dev.joaomario.carrental.dto.rentalrequest.EvaluationRequest;
import dev.joaomario.carrental.dto.rentalrequest.RentalRequestRequest;
import dev.joaomario.carrental.dto.rentalrequest.RentalRequestResponse;
import dev.joaomario.carrental.model.RequestStatus;
import dev.joaomario.carrental.service.ContractService;
import dev.joaomario.carrental.service.RentalRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rental-requests")
public class RentalRequestController {

    private final RentalRequestService rentalRequestService;
    private final ContractService contractService;

    public RentalRequestController(RentalRequestService rentalRequestService, ContractService contractService) {
        this.rentalRequestService = rentalRequestService;
        this.contractService = contractService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RentalRequestResponse create(@Valid @RequestBody RentalRequestRequest request) {
        return rentalRequestService.create(request);
    }

    @GetMapping
    public List<RentalRequestResponse> list(@RequestParam(required = false) RequestStatus status) {
        return rentalRequestService.list(status);
    }

    @GetMapping("/{id}")
    public RentalRequestResponse findById(@PathVariable Long id) {
        return rentalRequestService.findById(id);
    }

    @PutMapping("/{id}")
    public RentalRequestResponse update(@PathVariable Long id, @Valid @RequestBody RentalRequestRequest request) {
        return rentalRequestService.update(id, request);
    }

    @PatchMapping("/{id}/cancel")
    public RentalRequestResponse cancel(@PathVariable Long id) {
        return rentalRequestService.cancel(id);
    }

    @PostMapping("/{id}/contract")
    @ResponseStatus(HttpStatus.CREATED)
    public ContractResponse signContract(@PathVariable Long id, @Valid @RequestBody ContractRequest request) {
        return contractService.sign(id, request);
    }

    @PatchMapping("/{id}/evaluation")
    public RentalRequestResponse evaluate(@PathVariable Long id, @Valid @RequestBody EvaluationRequest request) {
        return rentalRequestService.evaluate(id, request);
    }
}
