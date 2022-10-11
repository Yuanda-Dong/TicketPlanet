from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from starlette.config import Config
from starlette.requests import Request
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import HTMLResponse, RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError

#Fast API Basic OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#Google Auth
# config = Config('.env')
# oauth = OAuth(config)

# CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
# oauth.register(
#     name='google',
#     server_metadata_url=CONF_URL,
#     client_kwargs={
#         'scope': 'openid email profile'
#     }
# )


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)
