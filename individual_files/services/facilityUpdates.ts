import { supabase } from '@/supabase/client';

export type FacilityUpdate = {
  id: string;
  instrument_id: string;
  update_type: 'training' | 'availability' | 'maintenance' | 'highlight';
  title: string;
  short_description: string;
  detailed_description?: string | null;
  is_active: boolean;
  created_at: string;
  instrument?: {
    name: string;
    code?: string | null;
  };
};

/**
 * Fetch active facility updates with instrument details
 * @param limit - Maximum number of updates to fetch (default: 3)
 */
export async function getFacilityUpdates(limit: number = 3): Promise<FacilityUpdate[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('facility_updates')
    .select(`
      id,
      instrument_id,
      update_type,
      title,
      short_description,
      detailed_description,
      is_active,
      created_at,
      instruments (
        name,
        code
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching facility updates:', error);
    return [];
  }

  return (data || []).map((update) => ({
    ...update,
    instrument: update.instruments ? {
      name: update.instruments.name,
      code: update.instruments.code
    } : undefined
  })) as FacilityUpdate[];
}

/**
 * Get badge color based on update type
 */
export function getUpdateTypeBadge(type: FacilityUpdate['update_type']) {
  switch (type) {
    case 'training':
      return { label: 'Training', color: 'bg-secondary', textColor: 'text-white' };
    case 'availability':
      return { label: 'Availability', color: 'bg-emerald-500', textColor: 'text-white' };
    case 'maintenance':
      return { label: 'Maintenance', color: 'bg-amber-500', textColor: 'text-white' };
    case 'highlight':
      return { label: 'Highlight', color: 'bg-accent', textColor: 'text-white' };
    default:
      return { label: 'Update', color: 'bg-slate-500', textColor: 'text-white' };
  }
}
