[X] make stripey background for desktop
[X] make game container mobile sized
[X] show a list of clickable buttons on load
[X] on click show text
[X] animated text scrolling/transitions -- timed fadeouts, hanging over the content
[X] transition after button click
[X] show the character stepping out into the world
[X] animate the color/appearance of the tunnel as it's in motion
[X] show the character emerging from the tunnel
[X] better framing/making better use of the screen space
[X] more interesting display of the "transition words"
[X] animate the transition words, do fade-out effect like:
    * https://codepen.io/LukeWinikates/pen/mdyrvLz
    * Use the same font “Tesselgram” shows up in. Use a mix of uppercase and spreading space.
    * Fade out older words as newer words fade in to make it more readable.
    * Fade them to a light but still visible gray.
    * Use font size ~~and capitalization~~ to call out the changes in emphasis/syllable stress, or just where the change is and their attention needs to be.
[ ] translucency effect on tunnel
    * https://developer.mozilla.org/ja/docs/Web/CSS/filter
[ ] fix up the thought-bubble-emoji again. "Splitting up the thought emoji isn’t as good as id hoped. The ninja one no longer scans visually."
[X] Calculate the width of the SVG element. Use that to set the viewport? On the basis of that, “center” the character’s exit point on the camera by setting the left edge to the destination point minus 50% of the width.
[ ] fix the "jump" that happens when the tunnel pans to the character position for the first time
[ ] harmonize the spacing again
    * use math to figure out the screen-center position
[ ] make the show-the-button timings feel more right
[ ] Make them say something when they go into the tunnel
[ ] Figure out the weird motion that happens on the mobile version (iOS at least...)
[ ] what if instead of panning (which doesn't look like anything), we zoom out, then back in as they exit the tunnel?
[ ] disable double-clicks
---------------
[ ] do favicon, etc
[ ] create backend analytics tracking
[ ] track number of times played
[ ] best-effort anonymous identity hash - ip address? session nonce?
[ ] link to feedback form
[ ] link to glitch page for feedback