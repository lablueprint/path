'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

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

  return (
    <div className="search-filter-wrapper">
      <Form.Control
        type="text"
        placeholder="Search users..."
        className="search-bar"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <Row className="g-2">
        <Col xs="auto">
          <Form.Select
            value={searchParams.get('role') ?? ''}
            onChange={(e) => handleRoleChange(e.target.value)}
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role.role_id} value={String(role.role_id)}>
                {role.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs="auto">
          {/* Clear button */}
          <Button
            type="button"
            className="search-filter-clear"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </Col>
      </Row>
    </div>
  );
}
