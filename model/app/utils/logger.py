import os
import logging

def log(log_type, message):
    log_file = '/home/kueyeon/workspace/chatty/model/logs/app.log'

    # Create the logs directory if it doesn't exist
    log_dir = os.path.dirname(log_file)
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # Configure logging
    logging.basicConfig(filename=log_file, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

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


"""
# Example usage
log_message('info', 'This is an info message')
log_message('warning', 'This is a warning message')
log_message('error', 'This is an error message')
"""