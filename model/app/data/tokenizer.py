from konlpy.tag import Mecab
from konlpy.tag import Okt
from queue import Queue
from utils.logger import *

class MecabPool:
    def __init__(self, size):
        self.size = size
        self.pool = Queue()
        for _ in range(size):
            self.pool.put(Mecab())

    def get_mecab(self):
        log('info', f'[app.py > quiz] get Mecab')
        return self.pool.get()

    def return_mecab(self, mecab):
        log('info', f'[app.py > quiz] put Mecab')
        self.pool.put(mecab)

class OktPool:
    def __init__(self, size):
        self.size = size
        self.pool = Queue()
        for _ in range(size):
            self.pool.put(Okt())

    def get_okt(self):
        log('info', f'[app.py > quiz] get Okt')
        return self.pool.get()

    def return_okt(self, okt):
        log('info', f'[app.py > quiz] put Okt')
        self.pool.put(okt)