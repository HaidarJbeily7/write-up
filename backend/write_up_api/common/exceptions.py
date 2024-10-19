from fastapi import HTTPException, status

class WriteUpException(Exception):
    """Base exception for WriteUp API"""
    pass

class DatabaseException(WriteUpException):
    """Exception raised for database-related errors"""
    def __init__(self, detail: str):
        self.detail = detail

class AuthenticationException(WriteUpException):
    """Exception raised for authentication-related errors"""
    def __init__(self, detail: str):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )

class AuthorizationException(WriteUpException):
    """Exception raised for authorization-related errors"""
    def __init__(self, detail: str):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
        )

class ResourceNotFoundException(WriteUpException):
    """Exception raised when a requested resource is not found"""
    def __init__(self, detail: str):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
        )

class ValidationException(WriteUpException):
    """Exception raised for data validation errors"""
    def __init__(self, detail: str):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
        )
