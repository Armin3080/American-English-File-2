window.addEventListener("DOMContentLoaded", () => {
    // Create an instance of ConcentricCircleLoader when the page is loaded
    const ccl = new ConcentricCircleLoader(".l");
});

class ConcentricCircleLoader {
    /** Milliseconds to start progress */
    delay = 750;
    /** Timeout function for progress increments */
    timeout = 0;
    /**
     * @param el CSS selector of the SVG
     */
    constructor(el) {
        this.el = document.querySelector(el);
        // Start the progress after the delay
        this.timeout = setTimeout(this.progressStart.bind(this), this.delay);
    }
    /** Progress amount in which 0 = 0% and 1 = 100% */
    _progress = 0;
    get progress() {
        return this._progress;
    }
    set progress(value) {
        this._progress = value;
        this.progressDisplay();
        // Check if progress has reached 100% (1)
        if (this.progress >= 1) {
            // Redirect to Private.html after 1 second delay
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        }
    }
    /** Displayed progress value */
    get progressPerceived() {
        return Math.floor(Easing.easeOutCirc(this.progress) * 100);
    }
    /** Loader is running. */
    _running = false;
    get running() {
        return this._running;
    }
    set running(value) {
        this._running = value;
        this.runningClass();
    }
    /** Display the progress as a readable value and `aria-label`. */
    progressDisplay() {
        // Update the aria label
        this.el?.setAttribute("aria-label", `${this.progressPerceived}%`);
        // Update the display value
        const progressEl = this.el?.querySelector("[data-progress]");

        if (progressEl) {
            progressEl.textContent = `${this.progressPerceived}`;
        }
    }
    /**
     * Increment the progress. When it reaches 100%, it stops the runner.
     * @param amount Amount to add
     */
    progressInc(amount = 0.01) {
        this.progress = this.progress + amount;

        if (this.progress >= 1) {
            this.progress = 1;
            this.running = false;
        } else if (this.running) {
            const timeoutInterval = 40;
            this.timeout = setTimeout(
                this.progressInc.bind(this, 0.01),
                timeoutInterval
            );
        }
    }
    /** Set the progress back to 0. */
    progressReset() {
        this.progress = 0;
    }
    /** Start incrementing the progress. */
    progressStart() {
        this.running = true;
        this.progressInc(0.01);
    }
    /** Add the CSS animations when the loader is running. */
    runningClass() {
        if (this.running) {
            const runningClass = "l--running";
            this.el?.classList.add(runningClass);
        }
    }
}

/** Easing functions from https://easings.net/ */
class Easing {
    /**
     * @param x Number along the X-axis (should be between 0 and 1)
     */
    static easeOutCirc(x) {
        return Math.sqrt(1 - (1 - x) ** 2);
    }
    /**
     * @param x Number along the X-axis (should be between 0 and 1)
     */
    static easeOutCubic(x) {
        return 1 - (1 - x) ** 3;
    }
    /**
     * @param x Number along the X-axis (should be between 0 and 1)
     */
    static easeOutSine(x) {
        return Math.sin((x * Math.PI) / 2);
    }
}
