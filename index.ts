import {
  type as osType,
  cpus as osCpus,
  freemem as osFreeMem,
  totalmem as osTotalMem
} from 'os';
import { IoTCentralDevice } from './device';
import { promises as fs } from 'fs';
import * as path from 'path';

const ENV_PATH = path.join(process.cwd(), '.env');

function log(message: string) {
  // tslint:disable-next-line:no-console
  console.log(message);
}

async function start() {
  try {
    log('🚀 Starting IoT Central device...');
    log(
      ` > Machine: ${osType()}, ${osCpus().length} core, ` +
        `freemem=${(osFreeMem() / 1024 / 1024).toFixed(0)}mb, totalmem=${(
          osTotalMem() /
          1024 /
          1024
        ).toFixed(0)}mb`
    );

    let { scopeId, deviceId, deviceKey, modelId } = process.env;

    if (!scopeId || !deviceId || !deviceKey || !modelId) {
      log(
        'Error - missing required environment variables scopeId, deviceId, deviceKey, modelId'
      );
      log(`Try reading from environment file ${ENV_PATH}`);
      try {
        ({ scopeId, deviceId, deviceKey, modelId } = (
          await fs.readFile(ENV_PATH)
        )
          .toString()
          .split(/\r?\n/)
          .reduce<{ [x: string]: string }>((obj, evar) => {
            const line = evar.split('=');
            obj[line[0]] = line[1];
            return obj;
          }, {}));
      } catch (ex) {
        log('Error reading environment file');
        return;
      }
    }
    log(`Device: ${deviceId}, Scope: ${scopeId}`);

    const iotDevice = new IoTCentralDevice(
      log,
      scopeId,
      deviceId,
      deviceKey,
      modelId
    );

    log('Starting device registration...');
    const connectionString = await iotDevice.provisionDeviceClient();

    if (connectionString) {
      log('Connecting the device...');
      await iotDevice.connectDeviceClient(connectionString);
    } else {
      log(' Failed to obtain connection string for device.');
    }
  } catch (error) {
    log(`👹 Error starting process: ${error.message}`);
  }
}

(async () => {
  await start();
})().catch();
