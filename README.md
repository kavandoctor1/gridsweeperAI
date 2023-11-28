# GridSweeperAI

The AI can beat minesweeper games including [Google's Minesweeper](https://www.google.com/fbx?fbx=minesweeper), [minesweeperonline.com](https://minesweeperonline.com/) and [minesweeper.online](https://minesweeper.online/) in exceedingly fast times.


There are two parts to this task: automating the reading and clicking, and creating an AI to choose what moves to make.

## Part 1: Automating Computer Vision

There are two possible approaches to this:

### Approach 1: Parsing the graphics through screenshots

With pyautogui, you can take a screenshot of the current screen with:

```py
import pyautogui
screenShot = pyautogui.screenshot()
```
From that image, the grid can be parsed.

Then, once the algorithm from Part 2 decides what squares are empty and which are mines, the empty squares can be clicked:
```py
pyautogui.click(x,y)
```
and the known mines can be flagged:
```py
pyautogui.click(x,y,button="right")
```

Putting it all together, gives:
```py
import pyautogui
import random
import webbrowser
import time
webbrowser.open('https://www.google.com/fbx?fbx=minesweeper') # opens minesweeper in webbrowser
time.sleep(1.5) # waits for game to load
getGridParameters() # uses helper function that takes a screenshot and finds where all the cells are
x,y = getCenter(random.randint(2,GRIDSIZE[0]-2),random.randint(2,GRIDSIZE[1]-2)) # chooses random cell to click on and finds its locations in pixels using helper function getCenter
pyautogui.click(x,y) # clicks on the cell
```
### Way 2: Interacting with web components directly through Javascript

In JavaScript, the HTML can be directly accessed, and so depending on the HTML structure, the grid can be directly read and modified.

## Part 2: Choosing Correct Moves
The AI uses multiple algorithms, first using elementary logic to find all mines.
Then, it uses graph theory to split the grid into connected components, and applies filtered DFS to generate mine configurations and pick the correct one with highest probability. 

