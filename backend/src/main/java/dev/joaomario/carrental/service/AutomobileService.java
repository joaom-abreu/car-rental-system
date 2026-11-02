package dev.joaomario.carrental.service;

import dev.joaomario.carrental.dto.automobile.AutomobileRequest;
import dev.joaomario.carrental.dto.automobile.AutomobileResponse;
import dev.joaomario.carrental.exception.BusinessRuleException;
import dev.joaomario.carrental.exception.NotFoundException;
import dev.joaomario.carrental.model.Automobile;
import dev.joaomario.carrental.repository.AutomobileRepository;
import dev.joaomario.carrental.security.CurrentUserProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.time.ZoneId;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class AutomobileService {

    private static final int MIN_YEAR = 1950;
    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");
    private static final Pattern PLATE_PATTERN = Pattern.compile("^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$");
    private static final String PLATE_FIELD = "plate";
    private static final String YEAR_FIELD = "year";
    private static final String REGISTRATION_FIELD = "registration";
    private static final String INVALID_PLATE_MESSAGE = "Placa inválida. Use o formato ABC1234 ou ABC1D23.";
    private static final String INVALID_YEAR_MESSAGE = "O ano deve estar entre %d e %d.";
    private static final String DUPLICATE_PLATE_MESSAGE = "Já existe um automóvel com esta placa.";
    private static final String DUPLICATE_REGISTRATION_MESSAGE = "Já existe um automóvel com esta matrícula.";
    private static final String NOT_FOUND_MESSAGE = "Automóvel não encontrado.";

    private final AutomobileRepository automobileRepository;
    private final CurrentUserProvider currentUserProvider;

    public AutomobileService(AutomobileRepository automobileRepository, CurrentUserProvider currentUserProvider) {
        this.automobileRepository = automobileRepository;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional(readOnly = true)
    public List<AutomobileResponse> findAll() {
        return automobileRepository.findAllByOrderByBrandAscModelAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AutomobileResponse findById(Long id) {
        return toResponse(findAutomobile(id));
    }

    @Transactional
    public AutomobileResponse create(AutomobileRequest request) {
        String plate = normalizePlate(request.plate());
        validate(plate, request.year());
        checkPlateAvailable(plate);
        checkRegistrationAvailable(request.registration());
        Automobile automobile = new Automobile(request.registration(), request.year(), request.brand(),
                request.model(), plate, currentUserProvider.getCurrentUser());
        return toResponse(automobileRepository.save(automobile));
    }

    @Transactional
    public AutomobileResponse update(Long id, AutomobileRequest request) {
        Automobile automobile = findAutomobile(id);
        String plate = normalizePlate(request.plate());
        validate(plate, request.year());
        if (!plate.equals(automobile.getPlate())) {
            checkPlateAvailable(plate);
        }
        if (!request.registration().equals(automobile.getRegistration())) {
            checkRegistrationAvailable(request.registration());
        }
        automobile.setRegistration(request.registration());
        automobile.setYear(request.year());
        automobile.setBrand(request.brand());
        automobile.setModel(request.model());
        automobile.setPlate(plate);
        return toResponse(automobile);
    }

    @Transactional
    public void delete(Long id) {
        automobileRepository.delete(findAutomobile(id));
    }

    private Automobile findAutomobile(Long id) {
        return automobileRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(NOT_FOUND_MESSAGE));
    }

    private String normalizePlate(String plate) {
        return plate.trim().toUpperCase().replace("-", "");
    }

    private void validate(String plate, int year) {
        if (!PLATE_PATTERN.matcher(plate).matches()) {
            throw new BusinessRuleException(INVALID_PLATE_MESSAGE, PLATE_FIELD);
        }
        int maxYear = Year.now(ZONE).getValue() + 1;
        if (year < MIN_YEAR || year > maxYear) {
            throw new BusinessRuleException(INVALID_YEAR_MESSAGE.formatted(MIN_YEAR, maxYear), YEAR_FIELD);
        }
    }

    private void checkPlateAvailable(String plate) {
        if (automobileRepository.existsByPlate(plate)) {
            throw new BusinessRuleException(DUPLICATE_PLATE_MESSAGE, PLATE_FIELD);
        }
    }

    private void checkRegistrationAvailable(String registration) {
        if (automobileRepository.existsByRegistration(registration)) {
            throw new BusinessRuleException(DUPLICATE_REGISTRATION_MESSAGE, REGISTRATION_FIELD);
        }
    }

    private AutomobileResponse toResponse(Automobile automobile) {
        return new AutomobileResponse(automobile.getId(), automobile.getRegistration(), automobile.getYear(),
                automobile.getBrand(), automobile.getModel(), automobile.getPlate(), automobile.getOwner().getName(),
                automobile.getOwner().getRole());
    }
}
