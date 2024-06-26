import React, {useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom";
import * as icon from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CNavItem,
  CNavTitle,
  CSidebar,
  CSidebarNav,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import Usuario from "../../../types/Usuario.ts";
import UsuarioService from "../../../services/UsuarioService.ts";
import {useAuth0} from "@auth0/auth0-react";

const Sidebar: React.FC = () => {

  const url = import.meta.env.VITE_API_URL;
  const usuarioService = new UsuarioService();
  const { sucursalId } = useParams(); // Obtén el ID de la URL
  const [ usuario, setUsuario ] = useState<Usuario>();
  const [ usuarioIsLoading, setUsuarioIsLoading ] = useState<boolean>(true);
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const fetchUsuario = async () => {
    try {
      const usuario = await usuarioService.getByEmail(url + "usuarioCliente/role/" + user?.email, {
        headers: {
          Authorization: `Bearer ${await getAccessTokenSilently({})}`
        }
      });

      setUsuario(usuario);

    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    } finally {
      setUsuarioIsLoading(false)
    }
  }

  useEffect(() => {
    if(user) {
      fetchUsuario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if(isAuthenticated) {
    if(isLoading || usuarioIsLoading) {
      return <div style={{height: "calc(100vh - 88px)"}} className="d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border" role="status"></div>
      </div>
    }
  }

  const hasRole = (roles: string[]) => {
    return roles.some(role => [usuario?.rol].includes(role));
  }

  return (
    <div className="border-end">
      <CSidebar
        className="d-flex flex-column"
        style={{ width: "100%" }}
      >
        <CSidebarNav style={{ display: "flex", flexDirection: "column" }}>
          <CNavTitle style={{ marginBottom: "10px" }}>Dashboard</CNavTitle>
          {
            ['ADMIN', 'SUPERADMIN'].includes(usuario?.rol || '')
            ? <CNavItem>
                <Link to="/inicio/1" className="nav-link">
                  <CIcon customClassName="nav-icon" icon={icon.cilHamburgerMenu} />
                  Inicio
                </Link>
              </CNavItem>
            : ''
          }
          {
            ['ADMIN', 'COCINERO', 'SUPERADMIN'].includes(usuario?.rol || '')
            ? <CNavItem hidden={hasRole(['ADMIN'])}>
                <Link to={`/productos/lista/${sucursalId}`} className="nav-link">
                  <CIcon customClassName="nav-icon" icon={icon.cilFastfood} />
                    Productos
                  </Link>
              </CNavItem>
            : ''
          }
          {
            ['ADMIN', 'SUPERADMIN'].includes(usuario?.rol || '')
            ? <CNavItem>
                <Link to={`/categorias/${sucursalId}`} className="nav-link">
                <CIcon customClassName="nav-icon" icon={icon.cilLineSpacing} />
                  Categorías
                </Link>
              </CNavItem>
            : ''
          }
          {
            ['ADMIN', 'SUPERADMIN'].includes(usuario?.rol || '')
            ? <CNavItem>
                <Link to={`/unidadMedida/${sucursalId}`} className="nav-link">
                  <CIcon customClassName="nav-icon" icon={icon.cilMediaStop} />
                    Unidad de Medida
                </Link>
              </CNavItem>
            : ''
          }
          {
            ['ADMIN', 'COCINERO', 'SUPERADMIN'].includes(usuario?.rol || '')
            ? <CNavItem>
                  <Link
                    to={`/articuloInsumo/Lista/${sucursalId}`} className="nav-link">
                    <CIcon customClassName="nav-icon" icon={icon.cilClipboard} />
                    Articulo Insumo
                  </Link>
              </CNavItem>
            : ''
          }
          {
            ['ADMIN', 'CAJERO', 'SUPERADMIN'].includes(usuario?.rol || '')
            ? <CNavItem>
                  <Link to={`/promociones/lista/${sucursalId}`} className="nav-link">
                  <CIcon customClassName="nav-icon" icon={icon.cilCash} />
                    Promociones
                  </Link>
              </CNavItem>
            : ''
          }
          {
            ['ADMIN', 'SUPERADMIN'].includes(usuario?.rol || '')
            ? <CNavItem>
                <Link to={`/usuario/${sucursalId}`} className="nav-link">
                  <CIcon customClassName="nav-icon" icon={icon.cilPeople} />
                  Usuarios
                </Link>
              </CNavItem>
            : ''
          }
          {
            ['ADMIN', 'COCINERO', 'CAJERO', 'SUPERADMIN'].includes(usuario?.rol || '')
              ? <CNavItem>
                  <Link to={`/pedidos/${sucursalId}`} className="nav-link">
                    <CIcon customClassName="nav-icon" icon={icon.cilApps} />
                    Pedidos
                  </Link>
                </CNavItem>
              : ''
          }
          {
            ['ADMIN', 'SUPERADMIN'].includes(usuario?.rol || '')
                ? <CNavItem>
                  <Link to={`/reportes/${sucursalId}`} className="nav-link">
                    <CIcon customClassName="nav-icon" icon={icon.cilChart} />
                    Reportes
                  </Link>
                </CNavItem>
                : ''
          }
        </CSidebarNav>
      </CSidebar>
    </div>
  );
};

export default Sidebar;
