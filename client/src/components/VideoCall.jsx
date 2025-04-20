import React, { useEffect, useRef, useState } from "react"
import socket from "../socket"

export default function VideoCall({ roomId }) {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const [peerConnection, setPeerConnection] = useState(null)
  const localStream = useRef(null)

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }, // Public STUN server
    ],
  }

  useEffect(() => {
    if (!peerConnection) {
      const pc = new RTCPeerConnection(iceServers)
      console.log("PeerConnection initialized:", pc)
      setPeerConnection(pc)

      const iceCandidateQueue = [] // Queue to store ICE candidates until remote description is set

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Emitting ICE candidate:", event.candidate)
          socket.emit("ice_candidate", { roomId, candidate: event.candidate })
        }
      }

      // Handle remote stream
      pc.ontrack = (event) => {
        console.log("Remote Stream:", event.streams[0])
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }
    }

    return () => {
      if (peerConnection) {
        peerConnection.close()
        console.log("PeerConnection closed")
      }
    }
  }, [peerConnection, roomId])

  useEffect(() => {
    const pc = new RTCPeerConnection(iceServers)
    console.log("PeerConnection initialized:", pc)
    setPeerConnection(pc)

    const iceCandidateQueue = [] // Queue to store ICE candidates until remote description is set

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Emitting ICE candidate:", event.candidate)
        socket.emit("ice_candidate", { roomId, candidate: event.candidate })
      }
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log("Remote Stream:", event.streams[0])
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    // Listen for incoming ICE candidates
    socket.on("ice_candidate", async ({ candidate, sid }) => {
      console.log("Received ICE candidate from:", sid)
      if (!pc.remoteDescription || !pc.remoteDescription.type) {
        console.log("Remote description not set yet. Queuing ICE candidate.")
        iceCandidateQueue.push(candidate)
      } else {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
          console.log("ICE candidate added successfully")
        } catch (error) {
          console.error("Error adding ICE candidate:", error)
        }
      }
    })

    // Listen for incoming offer
    socket.on("offer", async ({ sdp, sid }) => {
      console.log("Received offer from:", sid)
      await pc.setRemoteDescription(new RTCSessionDescription(sdp)) // Set the remote description
      console.log("Remote description set. Adding queued ICE candidates.")
      while (iceCandidateQueue.length > 0) {
        const candidate = iceCandidateQueue.shift()
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
          console.log("Queued ICE candidate added successfully")
        } catch (error) {
          console.error("Error adding queued ICE candidate:", error)
        }
      }
      const answer = await pc.createAnswer() // Create an answer
      await pc.setLocalDescription(answer) // Set the local description
      console.log("Emitting answer:", answer)
      socket.emit("answer", { roomId, sdp: pc.localDescription }) // Send the answer to the backend

      // Start the local camera for the second user
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        console.log("Local Stream (Second User):", stream)
        localStream.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        stream.getTracks().forEach((track) => pc.addTrack(track, stream))
      } catch (error) {
        console.error("Error accessing media devices for second user:", error)
      }
    })

    // Listen for incoming answer
    socket.on("answer", async ({ sdp, sid }) => {
      console.log("Received answer from:", sid)
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp)) // Set the remote description
        console.log("Remote description set for User 1. Adding queued ICE candidates.")
        while (iceCandidateQueue.length > 0) {
          const candidate = iceCandidateQueue.shift()
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
            console.log("Queued ICE candidate added successfully")
          } catch (error) {
            console.error("Error adding queued ICE candidate:", error)
          }
        }
      } catch (error) {
        console.error("Error setting remote description for User 1:", error)
      }
    })

    return () => {
      pc.close()
      console.log("PeerConnection closed")
      socket.off("offer")
      socket.off("ice_candidate")
      socket.off("answer")
    }
  }, [roomId])

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      console.log("Local Stream:", stream)
      localStream.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

      // Create an offer
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
      console.log("Emitting offer:", offer) // Log the offer
      socket.emit("offer", { roomId, sdp: offer }) // Send the offer to the backend
    } catch (error) {
      console.error("Error accessing media devices or creating an offer:", error)
    }
  }

  return (
    <div className="relative w-full h-full bg-black">
      {/* Remote Stream - Fullscreen */}
      <video
        ref={remoteVideoRef}
        autoPlay
        className="w-full h-full object-cover"
      />

      {/* Local Stream - Small Overlay in the Corner */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        className="absolute bottom-4 right-4 w-32 h-32 bg-gray-800 rounded-md border-2 border-white shadow-lg"
      />

      {/* Start Video Button */}
      <button
        onClick={startVideo}
        className="absolute top-4 left-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Start Video
      </button>
    </div>
  )
}