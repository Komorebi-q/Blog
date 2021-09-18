# useBattery

### 相关

-   [MDN getBattery](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/getBattery)
-   [MDN BatteryManager](https://developer.mozilla.org/zh-CN/docs/Web/API/BatteryManager)

```ts
interface BatteryManager {
    charing: boolean // 是否充电
    charingTime: number //距离充满还有多少秒, 0为已充满
    disCharingTime: number // 代表距离电池耗电至空且挂起需要多少秒
    level: number // 一个数字，代表电量的放大等级，这个值在 0.0 至 1.0 之间
    onchargeingchange: () => void
    oncharingtimechange: () => void
    ondischaringtimechange: () => void
    onlevelchange: () => void
}
```

```ts
interface BatteryState {
    charing: boolean // 是否充电
    charingTime: number //距离充满还有多少秒, 0为已充满
    disCharingTime: number // 代表距离电池耗电至空且挂起需要多少秒
    level: number // 一个数字，代表电量的放大等级，这个值在 0.0 至
}

interface BatteryManager extends Readonly<BatteryState>, EventTarget {
    onchargingchange: () => void
    onchargingtimechange: () => void
    ondischargingtimechange: () => void
    onlevelchange: () => void
}

// 扩展某种未完全实现功能
interface NavigatorWithPossibleBattery extends Navigator {
    getBattery?: () => Promise<BatteryManager>
}

type UseBatteryState =
    | { isSupported: false }
    | { isSupported: true; fetched: false }
    | ({ isSupported: true; fetched: true } & BatteryState)

const nva: NavigatorWithPossibleBattery | undefined = isNavigator
    ? navigator
    : undefined
const isBatteryApiSupported = nav && typeof nav.getBattery === "function"
```

```ts
function on(el, evtName, fn) {
    if (
        el &&
        typeof el.addElementListener === "function" &&
        evtName &&
        typeof fn === "function"
    ) {
        el.addEventListener(evtName, fn)
    }
}

function off(el, evtName, fn) {
    if (
        el &&
        typeof el.addElementListener === "function" &&
        evtName &&
        typeof fn === "function"
    ) {
        el.removeEventListener(evtName, fn)
    }
}

function useBatteryMock(): UseBatteryState {
    return { isSupported: false }
}

function useBattery() {
    // 还未 fetch batteryManger
    const [state, setState] = useState<UseBatteryState>({
        isSupported: true,
        fetched: false,
    })

    React.useEffect(() => {
        let isMounted = true
        let battery: BatteryManger | null = null
        let evts = [
            "chargingchange",
            "chargingtimechange",
            "dischargingtimechange",
            "levelchange",
        ]

        const handleChange = () => {
            if (!isMounted || !battery) {
                return
            }
            const newState: UseBatteryState = {
                isSupported: true,
                fetched: true,
                level: battery.level,
                charging: battery.charging,
                dischargingTime: battery.dischargingTime,
                chargingTime: battery.chargingTime,
            }
            !isDeepEqual(state, newState) && setState(newState)
        }

        function handleOnListener() {
            evts.forEach((evt) => on(battery, evt, handleChange))
        }
        function handleOffListener() {
             evts.forEach((evt) => off(battery, evt, handleChange))
        }

        nav!.getBattery!().then(bat: BatteryManger => {
            if (!isMounted) {
                return
            }
            battery = bat
            handleOnListener()
            handleChange()
        })

        return () => {
            isMounted = false
            if (battery) {
                handleOffListener()
            }
        }
    }, [])

    return state
}
```
