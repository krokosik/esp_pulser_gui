import { FormGroup, Icon, NumericInput } from "@blueprintjs/core";
import React from "react";
import { useAppStore } from "../store";
import { invoke } from "@tauri-apps/api/core";

const NetworkingStatus: React.FC = () => {
  const { tdUdpPort, setTdUdpPort, sensorStatus, connected } = useAppStore();
  const [localAmp, setLocalAmp] = React.useState(0);
  const handleUdpChange = (value: string) => {
    setTdUdpPort(parseInt(value));
  };

  React.useEffect(() => {
    setLocalAmp(sensorStatus?.led_amplitude || 0);
  }, [sensorStatus, connected]);

  return (
    <div>
      <h2>
        <Icon icon="globe-network" /> Networking & Status
      </h2>
      <FormGroup label="TD UDP Port" inline>
        <NumericInput
          style={{ width: "80px" }}
          placeholder="Enter TD UDP Port"
          value={tdUdpPort}
          onValueChange={(_, val) => handleUdpChange(val)}
          buttonPosition="none"
        />
      </FormGroup>
      <FormGroup label="LED amplitude" inline>
        <NumericInput
          style={{ width: "80px" }}
          value={localAmp}
          disabled={!connected && localAmp !== sensorStatus?.led_amplitude}
          onValueChange={(_, val) => {
            setLocalAmp(parseInt(val));
            invoke("change_led_amplitude", { amplitude: parseInt(val) })
          }}
          min={0}
          max={255}
          stepSize={1}
        />
      </FormGroup>
      <p>
        Heartbeat:{" "}
        <strong style={{ color: sensorStatus?.heart_ok ? "green" : "red" }}>
          {sensorStatus?.heart_ok ? "OK" : "Err"}
        </strong>
      </p>
      <p>
        Motor:{" "}
        <strong style={{ color: sensorStatus?.haptic_ok ? "green" : "red" }}>
          {sensorStatus?.haptic_ok ? "OK" : "Err"}
        </strong>
      </p>
      <p>
        Display:{" "}
        <strong style={{ color: sensorStatus?.display_ok ? "green" : "red" }}>
          {sensorStatus?.display_ok ? "OK" : "Err"}
        </strong>
      </p>
    </div>
  );
};

export default NetworkingStatus;
