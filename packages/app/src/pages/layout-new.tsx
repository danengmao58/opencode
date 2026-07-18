import { createEffect, Suspense, type ParentProps } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { DebugBar } from "@/components/debug-bar"
import { TabsInfoPopup } from "@/components/help-button"
import { Titlebar, type TitlebarUpdate } from "@/components/titlebar"
import { usePlatform } from "@/context/platform"
import { setNavigate } from "@/utils/notification-click"
import { setV2Toast, ToastRegion } from "@/utils/toast"

export default function NewLayout(props: ParentProps) {
  const platform = usePlatform()
  const navigate = useNavigate()
  setNavigate(navigate)

  createEffect(() => setV2Toast(true))

  const update: TitlebarUpdate = {
    version: () => {
      const state = platform.updater?.state()
      if (state?.status !== "ready") return
      return state.version
    },
    installing: () => platform.updater?.state().status === "installing",
    install: () => void platform.updater?.install(),
  }

  const isWindowsMica = platform.platform === "desktop" && platform.os === "windows"

  return (
    <div
      data-component="app-shell"
      classList={{
        "relative flex-1 min-h-0 min-w-0 flex flex-col select-none overflow-hidden rounded-[8px] [&_input]:select-text [&_textarea]:select-text [&_[contenteditable]]:select-text": true,
        "bg-v2-background-bg-deep": !isWindowsMica,
        "bg-transparent": isWindowsMica,
      }}
      style={isWindowsMica ? { background: "transparent", "background-color": "transparent", "border-radius": "8px", overflow: "hidden", "padding-top": "env(safe-area-inset-top, 0px)", "padding-bottom": "env(safe-area-inset-bottom, 0px)" } : {
        "border-radius": "8px",
        overflow: "hidden",
        "padding-top": "env(safe-area-inset-top, 0px)",
        "padding-bottom": "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <Titlebar update={update} />
      <main class="flex-1 min-h-0 min-w-0 overflow-x-hidden flex flex-col items-start contain-strict">
        <Suspense>{props.children}</Suspense>
      </main>
      {import.meta.env.DEV && <DebugBar inline />}
      <TabsInfoPopup />
      <ToastRegion v2 />
    </div>
  )
}
