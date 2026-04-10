import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useRealtimeAttendance() {
    const [list, setList] = useState<any[]>([])

    useEffect(() => {
        const channel = supabase
            .channel('attendance')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'attendance',
                },
                (payload) => {
                    setList((prev) => [...prev, payload.new])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return list
}