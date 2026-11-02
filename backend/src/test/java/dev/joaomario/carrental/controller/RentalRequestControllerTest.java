package dev.joaomario.carrental.controller;

import dev.joaomario.carrental.exception.GlobalExceptionHandler;
import dev.joaomario.carrental.service.ContractService;
import dev.joaomario.carrental.service.RentalRequestService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class RentalRequestControllerTest {

    private static final String EVALUATION_URL = "/api/rental-requests/1/evaluation";

    @Mock
    private RentalRequestService rentalRequestService;

    @Mock
    private ContractService contractService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new RentalRequestController(rentalRequestService, contractService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void evaluationWithEmptyOpinionReturns400WithFieldError() throws Exception {
        mockMvc.perform(patch(EVALUATION_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"approved\": true, \"opinion\": \"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.opinion").exists());
        verifyNoInteractions(rentalRequestService);
    }

    @Test
    void evaluationWithShortOpinionAndNoDecisionReturns400WithBothFieldErrors() throws Exception {
        mockMvc.perform(patch(EVALUATION_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"opinion\": \"ok\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.opinion").value("O parecer deve ter de 5 a 500 caracteres."))
                .andExpect(jsonPath("$.fieldErrors.approved").value("Escolha aprovar ou reprovar."));
        verifyNoInteractions(rentalRequestService);
    }
}
