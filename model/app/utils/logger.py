import os
import logging
from datetime import datetime

def log(log_type, message):
    # Generate a unique filename based on the current timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    file_name = f"model_{timestamp}.log"
    file_path = os.path.join(file_name)

    # Configure logging
    logging.basicConfig(filename=file_path, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    # Log the message with the specified type
    if log_type == 'debug':
        logging.debug(message)
    elif log_type == 'info':
        logging.info(message)
    elif log_type == 'warning':
        logging.warning(message)
    elif log_type == 'error':
        logging.error(message)
    elif log_type == 'critical':
        logging.critical(message)
    else:
        print("Invalid log type. Please use one of: debug, info, warning, error, critical")