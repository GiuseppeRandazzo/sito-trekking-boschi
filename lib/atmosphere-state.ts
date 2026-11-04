import { Color, Vector3 } from 'three'

/** Stato condiviso aggiornato ogni frame da <Atmosphere /> e letto da cielo, raggi e luci. */
export const atmosphere = {
  night: 0,
  fog: new Color('#4e7466'),
  top: new Color('#7fa3b0'),
  sunColor: new Color('#ffd9a0'),
  sunDir: new Vector3(-30, 16, -12).normalize(),
}
