import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockGetToken = jest.fn(() => 'token-123');

jest.mock('@siiges-ui/shared', () => ({
  getToken: (...args) => mockGetToken(...args),
}));

const getInstitucionesOpciones = require('../src/utils/getInstitucionesOpciones').default;

describe('getInstitucionesOpciones', () => {
  const originalUrl = process.env.NEXT_PUBLIC_URL;
  const originalApiKey = process.env.NEXT_PUBLIC_API_KEY;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_URL = 'https://api.example.com';
    process.env.NEXT_PUBLIC_API_KEY = 'test-api-key';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          { id: 1, nombre: 'Universidad A', usuarioId: 10 },
          { id: 2, nombre: 'Universidad B', usuarioId: 20 },
        ],
      }),
    });
  });

  afterAll(() => {
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_URL;
    else process.env.NEXT_PUBLIC_URL = originalUrl;
    if (originalApiKey === undefined) delete process.env.NEXT_PUBLIC_API_KEY;
    else process.env.NEXT_PUBLIC_API_KEY = originalApiKey;
  });

  it('fetches all lightweight institution options without pagination parameters', async () => {
    const setLoading = jest.fn();

    function HookHarness() {
      const { instituciones } = getInstitucionesOpciones({
        esNombreAutorizado: true,
        tipoInstitucionId: 1,
        setLoading,
      });

      return <div>{instituciones.map((item) => item.nombre).join(', ')}</div>;
    }

    render(<HookHarness />);

    await waitFor(() => {
      expect(screen.getByText('Universidad A, Universidad B')).toBeInTheDocument();
      expect(setLoading).toHaveBeenLastCalledWith(false);
    });

    const [requestUrl, requestOptions] = global.fetch.mock.calls[0];
    expect(requestUrl).toBe(
      'https://api.example.com/api/v1/instituciones/opciones?esNombreAutorizado=true&tipoInstitucionId=1',
    );
    expect(requestUrl).not.toContain('page=');
    expect(requestUrl).not.toContain('limit=');
    expect(requestOptions.headers).toMatchObject({
      api_key: 'test-api-key',
      Authorization: 'Bearer token-123',
    });
  });

  it('surfaces request failures and returns an empty options list', async () => {
    const setLoading = jest.fn();
    const logError = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockResolvedValue({ ok: false, status: 500 });

    function HookHarness() {
      const { instituciones } = getInstitucionesOpciones({ setLoading });
      return <div>{instituciones.length}</div>;
    }

    render(<HookHarness />);

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(setLoading).toHaveBeenLastCalledWith(false);
      expect(logError).toHaveBeenCalled();
    });

    logError.mockRestore();
  });
});
