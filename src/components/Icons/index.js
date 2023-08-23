import Icon from '@ant-design/icons';
import classnames from 'classnames';

import { IonBedOutline } from '@/components/Icons/bed.svg';
import { CilBath } from '@/components/Icons/bath.svg';
import { FluentEmojiHighContrastTriangularRuler } from '@/components/Icons/ruler.svg';
import { MaterialSymbolsBalcony } from '@/components/Icons/balcony.svg';
import { IconoirAirConditioner } from '@/components/Icons/airConditioner.svg';
import { IcOutlineElevator } from '@/components/Icons/elevator.svg';
import { MakiFurniture } from '@/components/Icons/furniture.svg';
import { MaterialSymbolsNightShelterOutlineRounded } from '@/components/Icons/shelter.svg';
import { IconParkOutlineFileCabinet } from '@/components/Icons/storageRoom.svg';
import { CarbonTemperatureWater } from '@/components/Icons/waterHeaterType.svg';
import { MdiWindowClosedVariant } from '@/components/Icons/window.svg';
import { BxHandicap } from '@/components/Icons/handicap.svg';
import { RiParkingBoxLine } from '@/components/Icons/parking.svg';
import { RiHome2Line } from '@/components/Icons/floor.svg';
import { FluentConferenceRoom24Regular } from '@/components/Icons/room.svg';
import { MdiShareAll } from '@/components/Icons/share.svg';

import styles from './icons.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const AirConditionIcon = props => <Icon component={IconoirAirConditioner} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const ShareIcon = props => <Icon component={MdiShareAll} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const WaterHeaterTypeIcon = props => <Icon component={CarbonTemperatureWater} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const RoomIcon = props => <Icon component={FluentConferenceRoom24Regular} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const DisabledAccessIcon = props => <Icon component={BxHandicap} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const FloorIcon = props => {
  const { floor, type } = props;

  return (
      <div className={classnames(styles.floor, styles[type])}>
        {typeof floor === 'undefined' ? null : <i>{floor}</i>}
        <Icon component={RiHome2Line} {...props} />
      </div>
  );
};

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const ParkingIcon = props => <Icon component={RiParkingBoxLine} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const WindowIcon = props => <Icon component={MdiWindowClosedVariant} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const StorageRoomIcon = props => <Icon component={IconParkOutlineFileCabinet} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const ShelterIcon = props => <Icon component={MaterialSymbolsNightShelterOutlineRounded} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const FurnitureIcon = props => <Icon component={MakiFurniture} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const ElevatorIcon = props => <Icon component={IcOutlineElevator} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const BedIcon = props => <Icon component={IonBedOutline} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const BalconyIcon = props => <Icon component={MaterialSymbolsBalcony} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const BathIcon = props => <Icon component={CilBath} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const RulerIcon = props => <Icon component={FluentEmojiHighContrastTriangularRuler} {...props} />;
