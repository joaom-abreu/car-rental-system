package dev.joaomario.carrental.service;

import dev.joaomario.carrental.dto.automobile.AutomobileRequest;
import dev.joaomario.carrental.dto.automobile.AutomobileResponse;
import dev.joaomario.carrental.exception.BusinessRuleException;
import dev.joaomario.carrental.model.Agent;
import dev.joaomario.carrental.model.AgentType;
import dev.joaomario.carrental.model.Automobile;
import dev.joaomario.carrental.model.Role;
import dev.joaomario.carrental.repository.AutomobileRepository;
import dev.joaomario.carrental.security.CurrentUserProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Year;
import java.time.ZoneId;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AutomobileServiceTest {

    private static final int NEXT_YEAR = Year.now(ZoneId.of("America/Sao_Paulo")).getValue() + 1;

    @Mock
    private AutomobileRepository automobileRepository;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @InjectMocks
    private AutomobileService automobileService;

    @Test
    void createSetsLoggedAgentAsOwnerAndNormalizesPlate() {
        Agent company = new Agent("locadora", "hash", "Locadora Savassi", AgentType.COMPANY);
        when(currentUserProvider.getCurrentUser()).thenReturn(company);
        when(automobileRepository.save(any(Automobile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AutomobileResponse response = automobileService.create(request("sav-1a23", 2023));

        assertThat(response.plate()).isEqualTo("SAV1A23");
        assertThat(response.ownerName()).isEqualTo("Locadora Savassi");
        assertThat(response.ownerRole()).isEqualTo(Role.AGENT);
    }

    @Test
    void createWithInvalidPlateThrowsBusinessRuleOnPlateField() {
        assertThatThrownBy(() -> automobileService.create(request("AB12345", 2023)))
                .isInstanceOf(BusinessRuleException.class)
                .hasFieldOrPropertyWithValue("field", "plate");
        verify(automobileRepository, never()).save(any());
    }

    @Test
    void createAcceptsOldPlateFormat() {
        when(currentUserProvider.getCurrentUser())
                .thenReturn(new Agent("locadora", "hash", "Locadora Savassi", AgentType.COMPANY));
        when(automobileRepository.save(any(Automobile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AutomobileResponse response = automobileService.create(request("abc-1234", 2023));

        assertThat(response.plate()).isEqualTo("ABC1234");
    }

    @Test
    void createWithDuplicatePlateThrowsBusinessRule() {
        when(automobileRepository.existsByPlate("SAV1A23")).thenReturn(true);

        assertThatThrownBy(() -> automobileService.create(request("SAV-1A23", 2023)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Já existe um automóvel com esta placa.")
                .hasFieldOrPropertyWithValue("field", "plate");
        verify(automobileRepository, never()).save(any());
    }

    @Test
    void createWithYearBefore1950ThrowsBusinessRuleOnYearField() {
        assertThatThrownBy(() -> automobileService.create(request("SAV1A23", 1949)))
                .isInstanceOf(BusinessRuleException.class)
                .hasFieldOrPropertyWithValue("field", "year");
    }

    @Test
    void createWithYearAfterNextYearThrowsBusinessRuleOnYearField() {
        assertThatThrownBy(() -> automobileService.create(request("SAV1A23", NEXT_YEAR + 1)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("O ano deve estar entre 1950 e %d.".formatted(NEXT_YEAR))
                .hasFieldOrPropertyWithValue("field", "year");
    }

    private AutomobileRequest request(String plate, int year) {
        return new AutomobileRequest("LOC-0001", year, "Fiat", "Argo", plate);
    }
}
