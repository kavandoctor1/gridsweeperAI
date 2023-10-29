
from minesweeper import *
import random

#https://www.google.com/fbx?fbx=minesweeper

class Google(MineSweeper):

    #Gets grid level: easy, medium or hard
    def getGridParameters(self):
        s = pyautogui.screenshot()
        self.LEFTCORNER = None
        w,h = s.size
        for i in range(0,w,3):
            done = False
            for j in range(0,h,3):
                if s.getpixel((i,j)) == self.BG[0] and not self.LEFTCORNER:
                    self.LEFTCORNER = (i,j)
                if s.getpixel((i,j)) == self.BG[1]:
                    #Top left of second square (used to determine size)
                    FIRSTPUT = (i,j)
                    done = True;break
            if done: break
        for i in range(w-1,0,-3):
            done = False
            for j in range(h-1,0,-3):
                if s.getpixel((i,j)) in self.BG+self.ZERO:
                    self.RIGHTCORNER = (i,j)
                    done = True;break
            if done: break
        #If there is no Left Corner, then the user is not on the correct website
        if self.LEFTCORNER == None:
            print('Wrong screen')
            return False
        self.SCREENDIMS = (self.RIGHTCORNER[0]-self.LEFTCORNER[0],self.RIGHTCORNER[1]-self.LEFTCORNER[1])
        size = (FIRSTPUT[1] - self.LEFTCORNER[1])/(self.RIGHTCORNER[1]-self.LEFTCORNER[1])
        if size  > 1/9:
            self.GRIDSIZE = (10,8)
            self.LEVEL = 'easy'
            self.NUMMINES = 10
        elif size > 1/17:
            self.GRIDSIZE = (18,14)
            self.LEVEL = 'medium'
            self.NUMMINES = 40
        else:
            self.GRIDSIZE = (24,20)
            self.LEVEL = 'hard'
            self.NUMMINES = 99
        self.MINES = {(i,j) : False for i in range(self.GRIDSIZE[0]) for j in range(self.GRIDSIZE[1]) }
        return True
        
    def getGrid(self,failedbefore = False):  
        time.sleep(self.TIMEINC)
        #reset mines
        screenShot = pyautogui.screenshot()
        self.GRID = [['?' for _ in range(self.GRIDSIZE[1])] for _ in range(self.GRIDSIZE[0])]
        self.markedFlags = set()
        for i in range(self.GRIDSIZE[0]):
            for j in range(self.GRIDSIZE[1]):
                #Find type for each square in grid
                a,b  = self.getCenter(i,j)
                #Reduce search space to just the center region of the square
                sq = round(self.SCREENDIMS[0]/(6*self.GRIDSIZE[0]))
                for inc1 in range(-sq,sq):
                    pixel = screenShot.getpixel((a+inc1,b+inc1))
                    if self.GRID[i][j] in '1234567': break
                    if pixel in self.BG:
                        self.GRID[i][j] = '-'
                    elif pixel in self.ZERO:
                        self.GRID[i][j] = '_'
                    else:
                        for ind in range(len(self.tileColors)):
                            if self.pixelsclose(pixel,self.tileColors[ind]):
                                self.GRID[i][j] = str(ind+1)
                                break
                        if self.pixelsclose(pixel,(242,54,7)):
                            self.markedFlags.add((i,j))

        #Error handling   
        unreadable = sum(row.count('?') for row in self.GRID)
        self.UNCLICKED = 0
        for i in range(self.GRIDSIZE[0]):
            for j in range(self.GRIDSIZE[1]):
                if self.GRID[i][j] in 'x-?':
                    self.UNCLICKED += 1
        if unreadable > 3 and self.NUMMINES - self.UNCLICKED < 3 and failedbefore:
            self.paramsReady = False
            return 'bad'
        elif unreadable > 2:
            print()
            for row in [[self.GRID[i][j] for i in range(self.GRIDSIZE[0])] for j in range(self.GRIDSIZE[1])]:
                print(' '.join(row))
            print('Grid unreadable')
            self.paramsReady = False
            #Try 2 times, in case there was an unexpected issue the first time
            if failedbefore:
                return 'bad'
            else:
                return self.getGrid(failedbefore=True)
        return self.GRID

    def run(self):
        self.paramsReady = False
        #Main input loop
        while True:
            if keyboard.is_pressed('h'):
                if not self.paramsReady:
                    self.paramsReady=self.getGridParameters()
                if self.paramsReady:
                    self.hint()
            elif keyboard.is_pressed('s'):
                if not self.paramsReady:
                    self.paramsReady=self.getGridParameters()
                if self.paramsReady:
                    self.solve()

#Constants for Google Minesweeper
SHOWFLAGS = True
BG = [(170, 215, 81),(162, 209, 73)]
ZERO = [(215, 184, 153),(229, 194, 159)]
ONE = (25, 118, 210)
TWO = (57,143,61)
THREE = (211,47,47)
FOUR = (123,31,162)
FIVE = (255,144,2)
SIX = (0,151,167)
SEVEN = (66,66,66)
FLAG = (242,54,7)


google = Google(SHOWFLAGS)

#Delay time to prevent parsing bugs
google.TIMEINC = 0.3

google.initColors([BG,ZERO,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN])

#Welcome Message
print("Welcome to Minesweeper Assistant")
print("Head over to Google Minesweeper to begin")
print("Press (h) to get a hint, and (s) to autosolve")
webbrowser.open('https://www.google.com/fbx?fbx=minesweeper')
#Begin
google.run()
