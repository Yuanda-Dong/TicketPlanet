from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from typing import List

# from starlette.config import Config
#
# config = Config(".env")


conf = ConnectionConfig(
    MAIL_USERNAME= "zyvp_dp@163.com",
    MAIL_PASSWORD= "MSYGSKNSXKWKOPER", #"2017lnxLnx", #"mlztnzzmpntswgqt",
    MAIL_FROM="zyvp_dp@163.com",
    MAIL_PORT=25,  # SSL = False, Port=25 || Port=465
    MAIL_SERVER="smtp.163.com",
    MAIL_FROM_NAME="BackendSystem",
    MAIL_TLS=False,
    MAIL_SSL=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


async def password_reset(subject: str, recipient: List, content: str):
    message = MessageSchema(
        subject=subject,
        recipients=recipient,
        html=content,
        subtype="html"
    )
    fm = FastMail(conf)
    result = await fm.send_message(message)
    print(result)
