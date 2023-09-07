import { Context } from '@siiges-ui/shared';
import { useContext } from 'react';

export default function deleteInstitucion(id) {
  const { session } = useContext(Context);
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  const url = process.env.NEXT_PUBLIC_URL;
  fetch(`${url}/api/v1/instituciones/${id}`, {
    method: 'DELETE',
    headers: { api_key: apikey, Authorization: `Bearer ${session.token}` },
  });
}