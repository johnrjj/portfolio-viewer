// Some generic scaffolding for a client-side reactive notification store
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface Notification {
  id: string
  title: string
  done: boolean
}

type State = {
  notifications: Record<string, Notification>
}

type Actions = {
  toggleNotification: (notificationId: string) => void
}

const useNotificationStore = create(
  immer<State & Actions>((set) => ({
    notifications: {
      '82471c5f-4207-4b1d-abcb-b98547e01a3e': {
        id: '82471c5f-4207-4b1d-abcb-b98547e01a3e',
        title: 'A',
        done: false,
      },
      '354ee16c-bfdd-44d3-afa9-e93679bda367': {
        id: '354ee16c-bfdd-44d3-afa9-e93679bda367',
        title: 'B',
        done: false,
      },
      '771c85c5-46ea-4a11-8fed-36cc2c7be344': {
        id: '771c85c5-46ea-4a11-8fed-36cc2c7be344',
        title: 'C',
        done: false,
      },
      '363a4bac-083f-47f7-a0a2-aeeee153a99c': {
        id: '363a4bac-083f-47f7-a0a2-aeeee153a99c',
        title: 'D',
        done: false,
      },
    },
    toggleNotification: (notificationId: string) =>
      set((state) => {
        state.notifications[notificationId].done =
          !state.notifications[notificationId].done
      }),
  })),
)

export { useNotificationStore }
