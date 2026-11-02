package dev.joaomario.carrental.exception;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import static org.hamcrest.Matchers.anEmptyMap;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GlobalExceptionHandlerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new FakeController())
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void notFoundExceptionReturns404WithFullErrorBody() throws Exception {
        mockMvc.perform(get("/test/not-found"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Pedido não encontrado."))
                .andExpect(jsonPath("$.path").value("/test/not-found"))
                .andExpect(jsonPath("$.timestamp", notNullValue()))
                .andExpect(jsonPath("$.fieldErrors", anEmptyMap()));
    }

    @Test
    void noResourceFoundExceptionReturns404WithGenericMessage() throws Exception {
        mockMvc.perform(get("/test/no-resource"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Recurso não encontrado."));
    }

    @Test
    void businessRuleExceptionReturns409() throws Exception {
        mockMvc.perform(get("/test/business-rule"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Já existe um cliente com este CPF."))
                .andExpect(jsonPath("$.fieldErrors", anEmptyMap()));
    }

    @Test
    void businessRuleExceptionWithFieldReturns409WithFieldError() throws Exception {
        mockMvc.perform(get("/test/business-rule-field"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Já existe um cliente com este CPF."))
                .andExpect(jsonPath("$.fieldErrors.cpf").value("Já existe um cliente com este CPF."));
    }

    @Test
    void forbiddenExceptionReturns403() throws Exception {
        mockMvc.perform(get("/test/forbidden"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Acesso negado."));
    }

    @Test
    void invalidCredentialsExceptionReturns401WithFixedMessage() throws Exception {
        mockMvc.perform(get("/test/invalid-credentials"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Usuário ou senha inválidos."));
    }

    @Test
    void invalidBodyReturns400WithFieldErrors() throws Exception {
        mockMvc.perform(post("/test/validation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.name").value("O nome é obrigatório."));
    }

    @Test
    void malformedJsonReturns400() throws Exception {
        mockMvc.perform(post("/test/validation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{name"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Corpo da requisição inválido."));
    }

    @Test
    void unexpectedExceptionReturns500WithoutInternalDetails() throws Exception {
        mockMvc.perform(get("/test/unexpected"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Erro interno no servidor."));
    }

    record SampleRequest(@NotBlank(message = "O nome é obrigatório.") String name) {
    }

    @RestController
    static class FakeController {

        @GetMapping("/test/not-found")
        void notFound() {
            throw new NotFoundException("Pedido não encontrado.");
        }

        @GetMapping("/test/no-resource")
        void noResource() throws NoResourceFoundException {
            throw new NoResourceFoundException(HttpMethod.GET, "/test/no-resource", "test/no-resource");
        }

        @GetMapping("/test/business-rule")
        void businessRule() {
            throw new BusinessRuleException("Já existe um cliente com este CPF.");
        }

        @GetMapping("/test/business-rule-field")
        void businessRuleWithField() {
            throw new BusinessRuleException("Já existe um cliente com este CPF.", "cpf");
        }

        @GetMapping("/test/forbidden")
        void forbidden() {
            throw new ForbiddenException("Acesso negado.");
        }

        @GetMapping("/test/invalid-credentials")
        void invalidCredentials() {
            throw new InvalidCredentialsException();
        }

        @PostMapping("/test/validation")
        void validation(@Valid @RequestBody SampleRequest request) {
        }

        @GetMapping("/test/unexpected")
        void unexpected() {
            throw new IllegalStateException("detalhe interno");
        }
    }
}
