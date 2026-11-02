package dev.joaomario.carrental.exception;

public class InvalidCredentialsException extends RuntimeException {

    private static final String MESSAGE = "Usuário ou senha inválidos.";

    public InvalidCredentialsException() {
        super(MESSAGE);
    }
}
