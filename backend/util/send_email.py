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



reset_template = """
    
    <html>
<body style="margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
<div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
  <div style="margin: 0 auto; width: 90%; text-align: center;">
    <h1 style="background-color: rgba(0, 53, 102, 1); padding: 5px 10px; border-radius: 5px; color: white;">Reset Password</h1>
    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
      <h3 style="margin-bottom: 100px; font-size: 24px;">Hi , {0:}!</h3>
      <p style="margin-bottom: 30px;">
        Request to reset password granted, use the link below to reset your user password.
        If you did not make this request kindly ignore this email and nothing will happen, thanks.
    </p>
        <a style="display: block; margin: 0 auto; border: none; background-color: rgba(255, 214, 10, 1); color: white; width: 200px; line-height: 24px; padding: 10px; font-size: 24px; border-radius: 10px; cursor: pointer; text-decoration: none;"
            href="http://localhost:3000/forgot-password?reset_password_token={1:}"
            target="_blank"
        >
            Reset password
      </a>
    </div>
  </div>
</div>
</body>
</html>
    """