package dev.joaomario.carrental.service;

import dev.joaomario.carrental.dto.client.ClientCreateRequest;
import dev.joaomario.carrental.dto.client.ClientResponse;
import dev.joaomario.carrental.dto.client.ClientUpdateRequest;
import dev.joaomario.carrental.dto.client.EmploymentDto;
import dev.joaomario.carrental.exception.BusinessRuleException;
import dev.joaomario.carrental.exception.ForbiddenException;
import dev.joaomario.carrental.model.Agent;
import dev.joaomario.carrental.model.AgentType;
import dev.joaomario.carrental.model.Client;
import dev.joaomario.carrental.repository.ClientRepository;
import dev.joaomario.carrental.repository.RentalRequestRepository;
import dev.joaomario.carrental.repository.UserRepository;
import dev.joaomario.carrental.security.CurrentUserProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    private static final EmploymentDto EMPLOYMENT = new EmploymentDto("Padaria Central", new BigDecimal("2500.00"));

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @Mock
    private RentalRequestRepository rentalRequestRepository;

    @InjectMocks
    private ClientService clientService;

    @Test
    void createSavesClientWithEncodedPasswordAndCpfOnlyDigits() {
        when(passwordEncoder.encode("senha1234")).thenReturn("hash");
        when(clientRepository.save(any(Client.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ClientResponse response = clientService.create(createRequest(List.of(EMPLOYMENT)));

        assertThat(response.cpf()).isEqualTo("52998224725");
        assertThat(response.employments()).containsExactly(EMPLOYMENT);
        verify(clientRepository).save(any(Client.class));
    }

    @Test
    void createWithDuplicateUsernameThrowsBusinessRule() {
        when(userRepository.existsByUsername("maria")).thenReturn(true);

        assertThatThrownBy(() -> clientService.create(createRequest(List.of())))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Este usuário já está em uso.")
                .hasFieldOrPropertyWithValue("field", "username");
        verify(clientRepository, never()).save(any());
    }

    @Test
    void createWithDuplicateCpfThrowsBusinessRule() {
        when(clientRepository.existsByCpf("52998224725")).thenReturn(true);

        assertThatThrownBy(() -> clientService.create(createRequest(List.of())))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Já existe um cliente com este CPF.")
                .hasFieldOrPropertyWithValue("field", "cpf");
        verify(clientRepository, never()).save(any());
    }

    @Test
    void createWithMoreThanThreeEmploymentsThrowsBusinessRule() {
        List<EmploymentDto> fourEmployments = List.of(EMPLOYMENT, EMPLOYMENT, EMPLOYMENT, EMPLOYMENT);

        assertThatThrownBy(() -> clientService.create(createRequest(fourEmployments)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("O cliente pode ter no máximo 3 empregos.")
                .hasFieldOrPropertyWithValue("field", "employments");
        verify(clientRepository, never()).save(any());
    }

    @Test
    void clientViewingAnotherClientThrowsForbidden() {
        when(currentUserProvider.getCurrentUser()).thenReturn(clientWithId(1L));

        assertThatThrownBy(() -> clientService.findById(2L))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void clientUpdatingAnotherClientThrowsForbidden() {
        when(currentUserProvider.getCurrentUser()).thenReturn(clientWithId(1L));

        assertThatThrownBy(() -> clientService.update(2L, updateRequest("Rua Nova, 10")))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void clientUpdatingOwnDataChangesAddress() {
        Client client = clientWithId(1L);
        when(currentUserProvider.getCurrentUser()).thenReturn(client);
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));

        ClientResponse response = clientService.update(1L, updateRequest("Rua Nova, 10"));

        assertThat(response.address()).isEqualTo("Rua Nova, 10");
    }

    @Test
    void agentCanViewAnyClient() {
        when(currentUserProvider.getCurrentUser())
                .thenReturn(new Agent("locadora", "hash", "Locadora Savassi", AgentType.COMPANY));
        when(clientRepository.findById(2L)).thenReturn(Optional.of(clientWithId(2L)));

        ClientResponse response = clientService.findById(2L);

        assertThat(response.id()).isEqualTo(2L);
    }

    @Test
    void searchWithFormattedCpfSearchesCpfByDigitsOnly() {
        when(clientRepository.findByNameContainingIgnoreCaseOrCpfContainingOrderByNameAsc("529.982", "529982"))
                .thenReturn(List.of(clientWithId(1L)));

        List<ClientResponse> response = clientService.search(" 529.982 ");

        assertThat(response).extracting(ClientResponse::id).containsExactly(1L);
    }

    @Test
    void searchByNameKeepsSameTermForCpf() {
        when(clientRepository.findByNameContainingIgnoreCaseOrCpfContainingOrderByNameAsc("maria", "maria"))
                .thenReturn(List.of());

        assertThat(clientService.search("maria")).isEmpty();
    }

    @Test
    void deleteClientWithRequestsThrowsBusinessRule() {
        Client client = clientWithId(1L);
        when(currentUserProvider.getCurrentUser()).thenReturn(client);
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(rentalRequestRepository.existsByClientId(1L)).thenReturn(true);

        assertThatThrownBy(() -> clientService.delete(1L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Não é possível excluir um cliente que tem pedidos.");
        verify(clientRepository, never()).delete(any());
    }

    private ClientCreateRequest createRequest(List<EmploymentDto> employments) {
        return new ClientCreateRequest("maria", "senha1234", "Maria Silva", "MG1234567", "529.982.247-25",
                "Rua A, 1", "Professora", employments);
    }

    private ClientUpdateRequest updateRequest(String address) {
        return new ClientUpdateRequest("Maria Silva", "MG1234567", "52998224725", address, "Professora", List.of());
    }

    private Client clientWithId(Long id) {
        Client client = new Client("maria", "hash", "Maria Silva", "MG1234567", "52998224725", "Rua A, 1",
                "Professora", List.of());
        ReflectionTestUtils.setField(client, "id", id);
        return client;
    }
}
