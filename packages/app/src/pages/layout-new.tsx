import { createEffect, Suspense, type ParentProps } from "solid-js"
import { useNavigate, useParams } from "@solidjs/router"
import { DebugBar } from "@/components/debug-bar"
import { HelpButton } from "@/components/help-button"
import { Titlebar, type TitlebarUpdate } from "@/components/titlebar"
import { useNotification } from "@/context/notification"
import { usePlatform } from "@/context/platform"
import { setNavigate } from "@/utils/notification-click"
import { setV2Toast, ToastRegion } from "@/utils/toast"

export default function NewLayout(props: ParentProps) {
  const platform = usePlatform()
  const notification = useNotification()
  const navigate = useNavigate()
  const params = useParams<{ id?: string }>()
  setNavigate(navigate)

  createEffect(() => setV2Toast(true))
  createEffect(() => {
    if (!notification.ready() || !params.id) return
    if (notification.session.unseenCount(params.id) === 0) return
    notification.session.markViewed(params.id)
  })

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
        "relative flex-1 min-h-0 min-w-0 flex flex-col select-none overflow-hidden rounded-[12px] [&_input]:select-text [&_textarea]:select-text [&_[contenteditable]]:select-text": true,
        "bg-v2-background-bg-deep": !isWindowsMica,
        "bg-transparent": isWindowsMica,
      }}
      style={isWindowsMica ? { background: "transparent", backgroundColor: "transparent", paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" } : {
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <Titlebar update={update} />
      <main class="flex-1 min-h-0 min-w-0 overflow-x-hidden flex flex-col items-start contain-strict">
        <Suspense>{props.children}</Suspense>
      </main>
      {import.meta.env.DEV && <DebugBar />}
      <HelpButton />
      <ToastRegion v2 />
    </div>
  )
}
