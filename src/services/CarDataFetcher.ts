/**
 * Auto-cache and fetch car data
 * @author Xingyu Zhou
 * */
import DateAvailable from "../interfaces/DateAvailable.ts";

interface IndexEntry {
    file: string,
    start: string,
    end: string
}

export default class CarDataFetcher<T extends DateAvailable> {
    private readonly url: string;
    private index: Array<IndexEntry> | undefined;
    private cache: Map<string, T[]> = new Map<string, T[]>();

    public constructor(url: string) {
        if (url.startsWith('/')) url = url.substring(1);
        if (url.endsWith('/')) url = url.substring(0, url.length - 1);
        this.url = url;
        fetch(`/${this.url}/index.json`)
            .then(response => response.json())
            .then(data => this.index = data);
    }

    /**
     * Query the data at the given timestamp
     * @param date timestamp string
     * @return the data, null if not found or not in cache
     * */
    public query(date: string | Date): T | null {
        const ts = typeof date === "string" ? Date.parse(date) : date.getTime();
        const fn = this.findFile(ts);
        if (fn === null) return null;
        const batch = this.queryBatch(fn);
        if (batch === null) return null;
        const i = this.lowerBound(batch, ts);
        return i >= 0 ? batch[i] : null;
    }

    /**
     * Get a batch of the data, cache if possible
     * @param fn file name
     * @return the batch, null if not in cache
     * */
    private queryBatch(fn: string): T[] | null {
        if (this.cache.has(fn)) return this.cache.get(fn)!;
        fetch(`/${this.url}/${fn}`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.cache.set(fn, data);
                return data;
            });
        return null;
    }

    /**
     * Find the nearest & latest data point before the given timestamp
     * @param batch to search
     * @param ts timestamp
     * @return index
     * */
    private lowerBound(batch: T[], ts: number): number {
        let lo = 0, hi = batch.length - 1, ans = -1;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (Date.parse(batch[mid].date) <= ts) {
                ans = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return ans;
    }

    /**
     * Find the slicing-file that contains the given timestamp via binary search
     * @return file name or null if not found
     * */
    private findFile(ts: number): string | null {
        if (this.index === undefined) {
            return null;
        }
        let lo = 0, hi = this.index.length - 1;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            const s = Date.parse(this.index[mid].start), e = Date.parse(this.index[mid].end);
            if (ts < s) {
                hi = mid - 1;
            } else if (ts > e) {
                lo = mid + 1;
            } else {
                // Perfect hit
                return this.index[mid].file;
            }
        }
        return null;
    }
}