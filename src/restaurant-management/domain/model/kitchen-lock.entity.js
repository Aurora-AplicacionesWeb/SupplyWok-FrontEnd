export class KitchenLock {
    constructor({id=null, userId=null, stateLocked=false, password='', lastLockedAt=null,
                    lastUnlockedAt=null, failAttempt=0, lockUntil=true}) {
        this.id = id;
        this.userId = userId;
        this.stateLocked = stateLocked;
        this.password = password;
        this.lastLockedAt = lastLockedAt ? new Date(lastLockedAt) : new Date();
        this.lastUnlockedAt = lastUnlockedAt ? new Date(lastUnlockedAt) : new Date();
        this.failAttempt = failAttempt;
        this.lockUntil = lockUntil;
    }
}