'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Role = {
  name: string;
  role_id: number;
};

type Props = {
  roles: Role[];
};

export default function UserSearch({ roles }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState(searchParams.get('query') ?? '');

  useEffect(() => {
    const currentQuery = searchParams.get('query') ?? '';
    if (inputValue === currentQuery) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = inputValue.trim();

      if (trimmed) {
        params.set('query', trimmed);
      } else {
        params.delete('query');
      }

      const nextQuery = params.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue, pathname, router, searchParams]);

  function handleRoleChange(roleId: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (roleId) {
      params.set('role', roleId);
    } else {
      params.delete('role');
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }

  function handleClearFilters() {
    setInputValue('');

    const params = new URLSearchParams(searchParams.toString());
    params.delete('query');
    params.delete('role');

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }

  function formatRole(role: string) {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
  const roleOrder = ['Owner', 'Superadmin', 'Admin', 'Requestor', 'Default'];
  const sortedRoles = [...roles].sort((a, b) => {
    const aIndex = roleOrder.indexOf(formatRole(a.name));
    const bIndex = roleOrder.indexOf(formatRole(b.name));
    return (
      (aIndex === -1 ? roleOrder.length : aIndex) -
      (bIndex === -1 ? roleOrder.length : bIndex)
    )
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search users"
      />

      <select
        value={searchParams.get('role') ?? ''}
        onChange={(e) => handleRoleChange(e.target.value)}
      >
        <option value="">All roles</option>
        {sortedRoles.map((role) => (
            <option key={role.role_id} value={String(role.role_id)}>
              {formatRole(role.name)}
            </option>
        ))}
      </select>

      <button onClick={handleClearFilters}>Clear filters</button>
    </div>
  );
}