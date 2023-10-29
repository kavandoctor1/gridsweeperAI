from minesweeper import *

#https://minesweeperonline.com/

class Classic(MineSweeper):
    def getGridParameters(self):
        if self.LEVEL == 'beginner':
            self.LEFTCORNER = (273,151)
            self.RIGHTCORNER = (418,295)
            self.SCREENDIMS = (self.RIGHTCORNER[0]-self.LEFTCORNER[0],self.RIGHTCORNER[1]-self.LEFTCORNER[1])
            self.GRIDSIZE= (9,9)
            self.NUMMINES = 10
        elif self.LEVEL == 'intermediate':
            self.LEFTCORNER = (273,151)
            self.RIGHTCORNER = (529,408)
            self.SCREENDIMS = (self.RIGHTCORNER[0]-self.LEFTCORNER[0],self.RIGHTCORNER[1]-self.LEFTCORNER[1])
            self.GRIDSIZE= (16,16)
            self.NUMMINES = 40
        elif self.LEVEL == 'expert':
            self.LEFTCORNER = (423,292)
            self.RIGHTCORNER = (1146,676)
            self.SCREENDIMS = (self.RIGHTCORNER[0]-self.LEFTCORNER[0],self.RIGHTCORNER[1]-self.LEFTCORNER[1])
            self.GRIDSIZE= (30,16)
            self.NUMMINES = 99
        self.MINES = {(i,j) : False for i in range(self.GRIDSIZE[0]) for j in range(self.GRIDSIZE[1]) }
        
    def getGrid(self,failedbefore = False,err=True):  
        time.sleep(self.TIMEINC)
        screenShot = pyautogui.screenshot()
        self.GRID = [['?' for _ in range(self.GRIDSIZE[1])] for _ in range(self.GRIDSIZE[0])]
        for i in range(self.GRIDSIZE[0]):
            for j in range(self.GRIDSIZE[1]):
                a,b  = self.getCenter(i,j)
                sq = 7
                for inc1 in range(sq,-sq,-1):
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
                    for inc1 in range(15):
                        pixel = screenShot.getpixel((a,b-inc1))
                        if self.pixelsclose(pixel,(255,255,255)):
                            self.GRID[i][j] = '-'
        unreadable = sum(row.count('?') for row in self.GRID)
        self.UNCLICKED = 0
        for i in range(self.GRIDSIZE[0]):
            for j in range(self.GRIDSIZE[1]):
                if self.GRID[i][j] in 'x-?':
                    self.UNCLICKED += 1
        if not err: return self.GRID
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
        if self.NEWWINDOW:
            webbrowser.open('https://minesweeperonline.com/#'+self.LEVEL)
            time.sleep(1.5)
        else:
            pyautogui.hotkey('alt', 'tab')
        self.getGridParameters()
        time.sleep(self.TIMEINC)
        self.getGrid()
        print('Level is',self.LEVEL)
        a,b = self.getCenter(self.GRIDSIZE[0]//2,self.GRIDSIZE[1]//2)
        pyautogui.click(a,b)
        time.sleep(self.TIMEINC)
        self.gameLoop()

SHOWFLAGS = True
BG = (189,189,189)
ZERO = (189,189,189)
ONE = (0,0,255)
TWO = (0,123,0)
THREE = (255,0,0)
FOUR = (0,0,123)
FIVE = (128,0,0)
SIX = (0,128,128)
classic = Classic(SHOWFLAGS)
classic.LEVEL = 'intermediate'
classic.NEWWINDOW = True
classic.TIMEINC = 0.02
classic.initColors([BG,ZERO,ONE,TWO,THREE,FOUR,FIVE,SIX])
classic.run()