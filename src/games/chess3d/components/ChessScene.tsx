"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import type { Move, Square } from "chess.js";
import { BOARD_FILES, BOARD_RANKS, squareToPosition } from "@/games/chess3d/engine/board";
import type { BoardTheme, ChessPieceModel, PieceTheme } from "@/games/chess3d/types";

type ChessSceneProps = {
  pieces: ChessPieceModel[];
  boardTheme: BoardTheme;
  pieceTheme: PieceTheme;
  selectedSquare: Square | null;
  legalMoves: Move[];
  onSquareClick: (square: Square) => void;
};

export function ChessScene({
  pieces,
  boardTheme,
  pieceTheme,
  selectedSquare,
  legalMoves,
  onSquareClick,
}: ChessSceneProps) {
  const legalSquares = new Set(legalMoves.map((move) => move.to));
  const captureSquares = new Set(legalMoves.filter((move) => move.captured).map((move) => move.to));

  return (
    <div className="h-[min(72vh,760px)] min-h-[430px] w-full overflow-hidden rounded-lg border border-white/10 bg-[#111827] shadow-soft sm:min-h-[560px]">
      <Canvas
        camera={{ fov: 42, position: [5.6, 6.6, 7.2] }}
        dpr={[1, 1.75]}
        shadows
      >
        <color attach="background" args={[boardTheme.background]} />
        <ambientLight intensity={0.75} />
        <directionalLight castShadow intensity={1.9} position={[4, 8, 5]} shadow-mapSize={[1024, 1024]} />
        <group rotation={[0, 0, 0]}>
          <BoardMesh
            boardTheme={boardTheme}
            captureSquares={captureSquares}
            legalSquares={legalSquares}
            onSquareClick={onSquareClick}
            selectedSquare={selectedSquare}
          />
          {pieces.map((piece) => (
            <PieceMesh key={piece.id} piece={piece} pieceTheme={pieceTheme} onSquareClick={onSquareClick} />
          ))}
        </group>
        <mesh receiveShadow position={[0, -0.09, 0]}>
          <boxGeometry args={[8.55, 0.12, 8.55]} />
          <meshStandardMaterial color={boardTheme.border} roughness={0.72} />
        </mesh>
        <OrbitControls
          enablePan={false}
          maxDistance={11}
          maxPolarAngle={Math.PI * 0.46}
          minDistance={5}
          minPolarAngle={Math.PI * 0.18}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}

function BoardMesh({
  boardTheme,
  captureSquares,
  legalSquares,
  onSquareClick,
  selectedSquare,
}: {
  boardTheme: BoardTheme;
  captureSquares: Set<Square>;
  legalSquares: Set<Square>;
  onSquareClick: (square: Square) => void;
  selectedSquare: Square | null;
}) {
  return (
    <>
      {BOARD_FILES.map((file, fileIndex) =>
        BOARD_RANKS.map((rank, rankIndex) => {
          const square = `${file}${rank}` as Square;
          const [x, , z] = squareToPosition(square);
          const isLight = (fileIndex + rankIndex) % 2 === 0;
          const isSelected = selectedSquare === square;
          const isLegal = legalSquares.has(square);
          const isCapture = captureSquares.has(square);

          return (
            <group key={square} position={[x, 0, z]}>
              <mesh receiveShadow onClick={() => onSquareClick(square)}>
                <boxGeometry args={[1, 0.12, 1]} />
                <meshStandardMaterial color={isLight ? boardTheme.lightSquare : boardTheme.darkSquare} roughness={0.82} />
              </mesh>
              {isSelected || isLegal ? (
                <mesh position={[0, 0.071, 0]} onClick={() => onSquareClick(square)}>
                  <boxGeometry args={[0.92, 0.02, 0.92]} />
                  <meshStandardMaterial
                    color={isSelected ? boardTheme.selectedSquare : isCapture ? boardTheme.captureMove : boardTheme.legalMove}
                    emissive={isSelected ? boardTheme.selectedSquare : isCapture ? boardTheme.captureMove : boardTheme.legalMove}
                    emissiveIntensity={0.18}
                    opacity={isSelected ? 0.55 : 0.36}
                    transparent
                  />
                </mesh>
              ) : null}
            </group>
          );
        }),
      )}
    </>
  );
}

function PieceMesh({
  piece,
  pieceTheme,
  onSquareClick,
}: {
  piece: ChessPieceModel;
  pieceTheme: PieceTheme;
  onSquareClick: (square: Square) => void;
}) {
  const [x, , z] = squareToPosition(piece.square);
  const color = piece.color === "w" ? pieceTheme.white : pieceTheme.black;
  const accent = piece.color === "w" ? pieceTheme.whiteAccent : pieceTheme.blackAccent;
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSquareClick(piece.square);
  };

  return (
    <group position={[x, 0.12, z]} onClick={handleClick}>
      <PieceBody type={piece.type} color={color} accent={accent} />
    </group>
  );
}

function PieceBody({ type, color, accent }: { type: ChessPieceModel["type"]; color: string; accent: string }) {
  if (type === "p") {
    return (
      <>
        <PieceBase color={color} />
        <mesh castShadow position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.18, 0.24, 0.36, 24]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
        <mesh castShadow position={[0, 0.63, 0]}>
          <sphereGeometry args={[0.2, 24, 16]} />
          <meshStandardMaterial color={accent} roughness={0.42} />
        </mesh>
      </>
    );
  }

  if (type === "r") {
    return (
      <>
        <PieceBase color={color} />
        <mesh castShadow position={[0, 0.42, 0]}>
          <boxGeometry args={[0.42, 0.56, 0.42]} />
          <meshStandardMaterial color={color} roughness={0.52} />
        </mesh>
        <mesh castShadow position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.16, 6]} />
          <meshStandardMaterial color={accent} roughness={0.45} />
        </mesh>
      </>
    );
  }

  if (type === "n") {
    return (
      <>
        <PieceBase color={color} />
        <mesh castShadow position={[0, 0.42, 0]} rotation={[0.25, 0, -0.25]}>
          <boxGeometry args={[0.34, 0.72, 0.42]} />
          <meshStandardMaterial color={color} roughness={0.48} />
        </mesh>
        <mesh castShadow position={[0.04, 0.83, -0.08]} rotation={[0.2, 0, -0.35]}>
          <coneGeometry args={[0.24, 0.46, 4]} />
          <meshStandardMaterial color={accent} roughness={0.5} />
        </mesh>
      </>
    );
  }

  if (type === "b") {
    return (
      <>
        <PieceBase color={color} />
        <mesh castShadow position={[0, 0.52, 0]}>
          <coneGeometry args={[0.33, 0.78, 28]} />
          <meshStandardMaterial color={color} roughness={0.46} />
        </mesh>
        <mesh castShadow position={[0, 0.94, 0]}>
          <sphereGeometry args={[0.13, 20, 12]} />
          <meshStandardMaterial color={accent} roughness={0.4} />
        </mesh>
      </>
    );
  }

  if (type === "q") {
    return (
      <>
        <PieceBase color={color} />
        <mesh castShadow position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.23, 0.34, 0.82, 28]} />
          <meshStandardMaterial color={color} roughness={0.44} />
        </mesh>
        <mesh castShadow position={[0, 1.02, 0]}>
          <sphereGeometry args={[0.24, 24, 16]} />
          <meshStandardMaterial color={accent} roughness={0.35} />
        </mesh>
      </>
    );
  }

  return (
    <>
      <PieceBase color={color} />
      <mesh castShadow position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.24, 0.34, 0.86, 28]} />
        <meshStandardMaterial color={color} roughness={0.44} />
      </mesh>
      <mesh castShadow position={[0, 1.03, 0]}>
        <sphereGeometry args={[0.18, 24, 16]} />
        <meshStandardMaterial color={accent} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[0, 1.25, 0]}>
        <boxGeometry args={[0.1, 0.34, 0.08]} />
        <meshStandardMaterial color={accent} roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0, 1.31, 0]}>
        <boxGeometry args={[0.32, 0.08, 0.08]} />
        <meshStandardMaterial color={accent} roughness={0.3} />
      </mesh>
    </>
  );
}

function PieceBase({ color }: { color: string }) {
  return (
    <>
      <mesh castShadow position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.32, 0.36, 0.18, 28]} />
        <meshStandardMaterial color={color} roughness={0.58} />
      </mesh>
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.12, 28]} />
        <meshStandardMaterial color={color} roughness={0.54} />
      </mesh>
    </>
  );
}
