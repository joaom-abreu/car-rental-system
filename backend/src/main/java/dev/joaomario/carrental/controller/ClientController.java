package dev.joaomario.carrental.controller;

import dev.joaomario.carrental.dto.client.ClientCreateRequest;
import dev.joaomario.carrental.dto.client.ClientResponse;
import dev.joaomario.carrental.dto.client.ClientUpdateRequest;
import dev.joaomario.carrental.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClientResponse create(@Valid @RequestBody ClientCreateRequest request) {
        return clientService.create(request);
    }

    @GetMapping
    public List<ClientResponse> search(@RequestParam(required = false) String search) {
        return clientService.search(search);
    }

    @GetMapping("/{id}")
    public ClientResponse findById(@PathVariable Long id) {
        return clientService.findById(id);
    }

    @PutMapping("/{id}")
    public ClientResponse update(@PathVariable Long id, @Valid @RequestBody ClientUpdateRequest request) {
        return clientService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        clientService.delete(id);
    }
}
