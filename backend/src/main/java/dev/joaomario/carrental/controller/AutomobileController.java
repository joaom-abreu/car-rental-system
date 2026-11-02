package dev.joaomario.carrental.controller;

import dev.joaomario.carrental.dto.automobile.AutomobileRequest;
import dev.joaomario.carrental.dto.automobile.AutomobileResponse;
import dev.joaomario.carrental.service.AutomobileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/automobiles")
public class AutomobileController {

    private final AutomobileService automobileService;

    public AutomobileController(AutomobileService automobileService) {
        this.automobileService = automobileService;
    }

    @GetMapping
    public List<AutomobileResponse> findAll() {
        return automobileService.findAll();
    }

    @GetMapping("/{id}")
    public AutomobileResponse findById(@PathVariable Long id) {
        return automobileService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AutomobileResponse create(@Valid @RequestBody AutomobileRequest request) {
        return automobileService.create(request);
    }

    @PutMapping("/{id}")
    public AutomobileResponse update(@PathVariable Long id, @Valid @RequestBody AutomobileRequest request) {
        return automobileService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        automobileService.delete(id);
    }
}
