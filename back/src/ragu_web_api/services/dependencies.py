from ragu_web_api.services.mock_repository import MockRepository

repository = MockRepository()


def get_repository() -> MockRepository:
    return repository
