import logging

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

def log(log_type, message):
    logger = logging.getLogger(__name__)
    
    if log_type == 'debug':
        logger.debug(message)
    elif log_type == 'info':
        logger.info(message)
    elif log_type == 'warning':
        logger.warning(message)
    elif log_type == 'error':
        logger.error(message)
    elif log_type == 'critical':
        logger.critical(message)
    else:
        logger.warning("Invalid log type. Please use one of: debug, info, warning, error, critical")