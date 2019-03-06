import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ColorPalette from './ColorPalette';
import DemoCanvas from './DemoCanvas';
import DemoSquare from './DemoSquare';
import DemoFlex from './DemoFlex';
import { Button, TabPane } from '../app/renderer/components';
import CollapsibleMenu from '../app/renderer/components/layout/SubNav/CollapsibleMenu';
import SimpleMenu from '../app/renderer/components/layout/SubNav/SimpleMenu';

global.styled = styled;
global.FontAwesomeIcon = FontAwesomeIcon;
global.Button = Button;
global.ColorPalette = ColorPalette;
global.DemoCanvas = DemoCanvas;
global.DemoSquare = DemoSquare;
global.DemoFlex = DemoFlex;
global.TabPane = TabPane;
global.CollapsibleMenu = CollapsibleMenu;
global.SimpleMenu = SimpleMenu;
