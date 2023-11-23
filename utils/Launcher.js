export default class Launcher {
    /**
     *
     * @param fps the custom game speed
     * @param animateFunc the drawing function
     */
    static launchGame(fps, animateFunc) {

        let fpsInterval, startTime, now, then, elapsed;
        function tick(animateFunc) {

            // request another frame

            requestAnimationFrame(() => {
                tick(animateFunc)
            });

            // calc elapsed time since last loop

            now = Date.now();
            elapsed = now - then;

            // if enough time has elapsed, draw the next frame

            if (elapsed > fpsInterval) {

                // Get ready for next frame by setting then=now, but also adjust for your
                // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
                then = now - (elapsed % fpsInterval);

                // Put your drawing code here
                animateFunc()
            }
        }

        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        tick(animateFunc);

    }
}