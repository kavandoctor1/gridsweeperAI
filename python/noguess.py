from minesweeper import *

#https://minesweeper.online/

class NoGuess(MineSweeper):
    def getGridParameters(self):
        if self.LEVEL == 'easy':
            self.LEFTCORNER = (458,293)
            self.RIGHTCORNER = (672,508)
            self.SCREENDIMS = (self.RIGHTCORNER[0]-self.LEFTCORNER[0],self.RIGHTCORNER[1]-self.LEFTCORNER[1])
            self.GRIDSIZE= (9,9)
            self.NUMMINES = 10
        elif self.LEVEL == 'medium':
            self.LEFTCORNER = (458,293)
            self.RIGHTCORNER = (842,675)
            self.SCREENDIMS = (self.RIGHTCORNER[0]-self.LEFTCORNER[0],self.RIGHTCORNER[1]-self.LEFTCORNER[1])
            self.GRIDSIZE= (16,16)
            self.NUMMINES = 40
        elif self.LEVEL == 'hard':
            self.LEFTCORNER = (423,292)
            self.RIGHTCORNER = (1146,676)
            self.SCREENDIMS = (self.RIGHTCORNER[0]-self.LEFTCORNER[0],self.RIGHTCORNER[1]-self.LEFTCORNER[1])
            self.GRIDSIZE= (30,16)
            self.NUMMINES = 99
        elif self.LEVEL == 'evil':
            #90% zoom:
            self.LEFTCORNER = (448,271)
            self.RIGHTCORNER = (1096,700)
            self.SCREENDIMS = (self.RIGHTCORNER[0]-self.LEFTCORNER[0],self.RIGHTCORNER[1]-self.LEFTCORNER[1])
            self.GRIDSIZE= (30,20)
            self.NUMMINES = 130
        self.MINES = {(i,j) : False for i in range(self.GRIDSIZE[0]) for j in range(self.GRIDSIZE[1]) }
        
    def getGrid(self,failedbefore = False,err=True):  
        time.sleep(self.TIMEINC)
        screenShot = pyautogui.screenshot()
        self.GRID = [['?' for _ in range(self.GRIDSIZE[1])] for _ in range(self.GRIDSIZE[0])]
        for i in range(self.GRIDSIZE[0]):
            for j in range(self.GRIDSIZE[1]):
                a,b  = self.getCenter(i,j)
                sq = round(self.SCREENDIMS[0]/(6*self.GRIDSIZE[0]))
                for inc1 in range(-sq,sq):
                    pixel = screenShot.getpixel((a+inc1,b+inc1))
                    if self.GRID[i][j] in 'x1234567': break
                    if pixel == self.BG:
                        self.GRID[i][j] = '_'
                    elif self.pixelsclose(pixel,(0,0,0)):
                        self.GRID[i][j] = 'x'
                    else:
                        for ind in range(len(self.tileColors)):
                            if self.pixelsclose(pixel,self.tileColors[ind]):
                                self.GRID[i][j] = str(ind+1)
                                break
                if self.GRID[i][j] == '_':
                    for inc1 in range(self.SCREENDIMS[0]//self.GRIDSIZE[0]):
                        pixel = screenShot.getpixel((a,b-inc1))
                        if pixel == (255,255,255):
                            self.GRID[i][j] = '-'
        unreadable = sum(row.count('?') for row in self.GRID)
        self.UNCLICKED = 0
        for i in range(self.GRIDSIZE[0]):
            for j in range(self.GRIDSIZE[1]):
                if self.GRID[i][j] in 'x-?':
                    self.UNCLICKED += 1
        if not err: return self.GRID
        if unreadable > 3 and self.NUMMINES - self.UNCLICKED < 3 and failedbefore:
            self.endCode()
        #Error handling if more than 1 cell is unreadable
        elif unreadable > 1 :
            print()
            for row in [[self.GRID[i][j] for i in range(self.GRIDSIZE[0])] for j in range(self.GRIDSIZE[1])]:
                print(' '.join(row))
            print('Grid unreadable')
            screenShot.save('ss.jpg')
            #Tries to get a screenshot again, if first time failed
            if failedbefore:
                #If failed twice, exit
                sys.exit()
            else:
                return self.getGrid(failedbefore=True)
        return self.GRID

    def run(self):
        pyautogui.hotkey('alt', 'tab')
        self.getGridParameters()
        time.sleep(self.TIMEINC)
        self.getGrid()
        start = (-1,-1)
        for i in range(self.GRIDSIZE[0]):
            for j in range(self.GRIDSIZE[1]):
                if self.GRID[i][j] == '2':
                    start = (i,j)
        a,b = self.getCenter(start[0],start[1])
        pyautogui.click(a,b)
        self.gameLoop()

SHOWFLAGS = True
BG = (198,198,198)
ZERO = (198,198,198)
ONE = (0,0,255)
TWO = (0,123,0)
THREE = (255,0,0)
FOUR = (0,0,123)
FIVE = (128,0,0)
SIX = (0,128,128)
noguess = NoGuess(SHOWFLAGS)
noguess.LEVEL = 'medium'
noguess.TIMEINC = 0.02
noguess.initColors([BG,ZERO,ONE,TWO,THREE,FOUR,FIVE,SIX])
noguess.run()