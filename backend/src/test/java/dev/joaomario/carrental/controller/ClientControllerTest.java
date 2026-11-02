package dev.joaomario.carrental.controller;

import dev.joaomario.carrental.dto.client.ClientCreateRequest;
import dev.joaomario.carrental.dto.client.ClientResponse;
import dev.joaomario.carrental.exception.GlobalExceptionHandler;
import dev.joaomario.carrental.service.ClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ClientControllerTest {

    private static final String VALID_BODY = """
            {
              "username": "maria",
              "password": "senha1234",
              "name": "Maria Silva",
              "rg": "MG1234567",
              "cpf": "529.982.247-25",
              "address": "Rua A, 1",
              "profession": "Professora",
              "employments": [{"employer": "Padaria Central", "income": 2500.00}]
            }
            """;

    private static final String INVALID_BODY = """
            {
              "username": "ma",
              "password": "curta",
              "name": "Maria Silva",
              "rg": "MG1234567",
              "cpf": "111.111.111-11",
              "address": "Rua A, 1",
              "profession": "Professora",
              "employments": [{"employer": "Padaria Central", "income": 0}]
            }
            """;

    @Mock
    private ClientService clientService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new ClientController(clientService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void createWithValidBodyReturns201WithClient() throws Exception {
        ClientResponse response = new ClientResponse(1L, "maria", "Maria Silva", "MG1234567", "52998224725",
                "Rua A, 1", "Professora", List.of(), Instant.now());
        when(clientService.create(any(ClientCreateRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/clients").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.cpf").value("52998224725"))
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
    }

    @Test
    void createWithInvalidBodyReturns400WithFieldErrors() throws Exception {
        mockMvc.perform(post("/api/clients").contentType(MediaType.APPLICATION_JSON).content(INVALID_BODY))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.username").exists())
                .andExpect(jsonPath("$.fieldErrors.password").value("A senha deve ter no mínimo 8 caracteres."))
                .andExpect(jsonPath("$.fieldErrors.cpf").value("CPF inválido."))
                .andExpect(jsonPath("$.fieldErrors['employments[0].income']")
                        .value("O rendimento deve ser maior que zero."));
        verifyNoInteractions(clientService);
    }
}
