from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from typing import List
from fastapi import Request

# from starlette.config import Config
#
# config = Config(".env")


conf = ConnectionConfig(
    MAIL_USERNAME="zyvp_dp@163.com",
    MAIL_PASSWORD="MSYGSKNSXKWKOPER",  # "2017lnxLnx", #"mlztnzzmpntswgqt",
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


async def event_update_notice(request: Request, event_id: str):
    # sending email to user while the event has been updated
    # get updated event info
    updated_event = request.app.database["events"].find_one({"_id": event_id})
    # get booked user email list
    recipient = []
    users = request.app.database["passes"].find({"event_id": event_id}, {"user_id": 1})
    for user in users:
        user_email = request.app.database["users"].find_one({"_id": user["user_id"]})["email"]
        recipient.append(user_email)
    content = event_update_template.format(updated_event['title'], event_id)

    message = MessageSchema(
        subject="Event update notice",
        recipients=recipient,
        html=content,
        subtype="html"
    )
    fm = FastMail(conf)
    result = await fm.send_message(message)
    print(result)


event_update_template = '''

<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>event update</title>
</head>
<body>
  <div>
    <h1>Event {0:} has been updated</h1>
    <h1>Please click the link below to check the latest information</h1>
    <a style="display: block; margin: 0 auto; border: none; background-color: rgba(255, 214, 10, 1); color: white; width: 80px; line-height: 24px; padding: 10px; font-size: 24px; border-radius: 10px; cursor: pointer; text-decoration: none;" 
      href="http://localhost:3000/event/{1:}" 
      target="_blank"
    >
        link
    </a>
  </div>
</body>
</html>

'''


async def buy_notice(request: Request, event_id: str, user_id: str):
    # get event
    buy_event = request.app.database["events"].find_one({"_id": event_id})
    # get buyer
    user_email = request.app.database["users"].find_one({"_id": user_id})["email"]
    recipient = [user_email]
    content = buy_template.format(buy_event['title'], event_id)
    message = MessageSchema(
        subject="Book event notice",
        recipients=recipient,
        html=content,
        subtype="html"
    )
    fm = FastMail(conf)
    result = await fm.send_message(message)
    print(result)


buy_template = '''

<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>event update</title>
</head>
<body>
  <div>
    <h1>Thank you for booking event {0:}</h1>
    <h1>Please click the link below to check the latest information</h1>
    <a style="display: block; margin: 0 auto; border: none; background-color: rgba(255, 214, 10, 1); color: white; width: 80px; line-height: 24px; padding: 10px; font-size: 24px; border-radius: 10px; cursor: pointer; text-decoration: none;" 
      href="http://localhost:3000/event/{1:}" 
      target="_blank"
    >
        link
    </a>
  </div>
</body>
</html>

'''


async def cancel_book(request: Request, event_id: str, user_id: str):
    # get event
    event = request.app.database["events"].find_one({"_id": event_id})
    # get user
    user_email = request.app.database["users"].find_one({"_id": user_id})["email"]
    recipient = [user_email]
    content = cancel_book_template.format(event['title'])
    message = MessageSchema(
        subject="Cancel book event notice",
        recipients=recipient,
        html=content,
        subtype="html"
    )
    fm = FastMail(conf)
    result = await fm.send_message(message)
    print(result)


cancel_book_template = '''
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>event cancel book</title>
</head>
<body>
  <div>
    <h1>event {0:} cancel book success</h1>
  </div>
</body>
</html>

'''