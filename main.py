from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)

@app.route('/send', methods=['POST'])
def send_email():
    data = request.get_json()

    msg = MIMEText(data['body'])
    msg['Subject'] = data['subject']
    msg['From'] = 'your-email@yoanamail.com'
    msg['To'] = data['to']

    try:
        with smtplib.SMTP('localhost') as server:
            server.sendmail(msg['From'], [msg['To']], msg.as_string())
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
